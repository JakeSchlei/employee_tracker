const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  welcomeMessage();
});

welcomeMessage = () => {
  console.log("Employee Tracker!");
  promptUser();
};

// show all employees function
showEmployees = () => {
  const sql = `SELECT e.id, e.first_name, e.last_name,
                    emp_role.title,
                    emp_role.salary,
                    department.dept_name AS department,
                    CONCAT(employee.first_name, ' ', employee.last_name) AS manager
                    FROM employee AS e
                    LEFT JOIN emp_role
                    ON e.role_id = emp_role.id
                    LEFT JOIN department
                    ON emp_role.dept_id = department.id
                    LEFT JOIN employee
                    ON e.manager_id = employee.id
                    ORDER BY department`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(
        "\n**************************** Employees ********************************"
      );
      console.table(rows);
    })
    .then(promptUser)
    .catch(console.log());
};

// add employee function
const addEmployee = function(rolesArray, managerArray) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: rolesArray,
      },
      {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: managerArray
      }
    ])
    .then((answers) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,(SELECT id FROM emp_role WHERE title = ?), (SELECT id FROM employee AS e WHERE CONCAT(first_name, ' ', last_name) = ?))`;
      const inputs = [answers.firstName, answers.lastName, answers.role, answers.manager];

      connection
        .promise()
        .query(sql, inputs)
        .then(() => {
          console.log("New Employee Added");
        })
        .then(promptUser)
        .catch(console.log());
    });
};

// show roles function
const showRoles = function () {
  const sql = `SELECT emp_role.id, emp_role.title, emp_role.salary,
                department.dept_name AS department
                FROM emp_role
                LEFT JOIN department
                ON emp_role.dept_id = department.id
                ORDER BY department`;
  connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log("\n*************** ROLES ******************");
      console.table(rows);
    })
    .then(promptUser)
    .catch(console.log());
};

// Show all Departments
const viewDepartments = function() {
    const sql = `SELECT department.id,
    department.dept_name AS department
    FROM department`;
    connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
        console.log("\n* DEPARTMENTS *");
        console.table(rows);
    })
    .then(promptUser)
    .catch(console.log());
};

// Update Employee Role
const updateEmpRole = function(employeeArray,rolesArray) {
    inquirer.prompt(
        [
            {
                type: 'list',
                name: 'employee',
                message: 'What employee would you like to update?',
                choices: employeeArray
            },
            {
                type: 'list',
                name: 'role',
                message: 'What role will the employee have?',
                choices: rolesArray
            }
        ]
    )
    .then(answers => {
        const sql = `UPDATE employee SET role_id = (SELECT id FROM emp_role WHERE title = ?) WHERE CONCAT(first_name, ' ', last_name) = ?`;
        const input = [answers.role, answers.employee];
        connection.promise().query(sql, input)
        .then( () => {
            console.log("EMPLOYEE INFORMATION UPDATED!!");
            promptUser();
        })
      
    })
}

// Add Role
const addRole = function(departmentArray) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What will the salary be for this role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department will this new role belong to?',
            choices: departmentArray
        }
    ])
    .then(answers => {
        const sql = `INSERT INTO emp_role (title, salary, dept_id)
                    VALUES (?, ?,(SELECT id FROM department WHERE dept_name = ?))`;
        const input = [answers.title, answers.salary, answers.department];
        connection.promise().query(sql, input)
        .then( () => {
            console.log('NEW ROLE ADDED!!');
            promptUser();
        })
    })
    

   
}

// Add Department 
const addDepartment = function() {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'dept_name',
            message: 'What is the name of the new department?'
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (dept_name)
                    VALUES (?)`;
        const input = [answer.dept_name];  
        connection.promise().query(sql, input)
        .then( () => {
            console.log('NEW DEPARTMENT ADDED!!');
            promptUser();
        }) 

    })
   
};

// Questions Section
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View All Employees") {
        showEmployees();
      }
      if (choices === "Add Employee") {
        let rolesArray = [];
        let managerArray = ['None'];

        connection
          .promise()
          .query(`SELECT title FROM emp_role`)
          .then(([rows, fields]) => {
            for (let i = 0; i < rows.length; i++) {
              rolesArray.push(rows[i].title);
            }
            return rolesArray;
          })
          .then(connection.promise().query(`SELECT CONCAT(first_name, ' ' , last_name) AS full_name FROM employee`)
          .then(([rows, fields]) => {
            for (let i = 0; i < rows.length; i++) {
                managerArray.push(rows[i].full_name);
            }
            return managerArray
          })
          )
          .then((rolesArray) => addEmployee(rolesArray, managerArray));
      }
      if (choices === "View All Roles") {
        showRoles();
      }
      if (choices === "View All Departments") {
        viewDepartments();
      }
      if (choices === "Update Employee Role") {
        let employeeArray = [];
        let rolesArray = [];
        connection.promise().query(`SELECT CONCAT(first_name, ' ' , last_name) AS full_name FROM employee`)
        .then(([rows, fields]) => {
            for (let i = 0; i < rows.length; i++) {
                employeeArray.push(rows[i].full_name);
            }
            return employeeArray;
        })
        .then(connection.promise().query(`SELECT title FROM emp_role`)
        .then(([rows, fields]) => {
            for (let i = 0; i < rows.length; i++) {
                rolesArray.push(rows[i].title);
            }
        }))
        .then(employeeArray => updateEmpRole(employeeArray,rolesArray))
      }
      if (choices === "Add Role") {
        let departmentArray = [];
        connection.promise().query(`SELECT dept_name FROM department`)
        .then(([rows, fields]) => {
            for (let i = 0; i < rows.length; i++) {
                departmentArray.push(rows[i].dept_name)
            }
            return departmentArray;
        })
        .then(departmentArray => addRole(departmentArray));
      }
      if (choices === "Add Department") {
        addDepartment();
      }
      if (choices === "Exit") {
        console.log('BYE!')
        process.exit();
      }
    });
};
