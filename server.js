const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tracker_db'
});

connection.connect(err => {
    if (err) throw err;
    welcomeMessage();
});

welcomeMessage = () => {
    console.log('Employee Tracker!');
    promptUser();
};



 showEmployees = () => {
    const sql = `SELECT e.id, e.first_name, e.last_name,
                    emp_role.title AS title,
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
                    ORDER BY department`
    connection.promise().query(sql)
    .then (([rows, fields]) => {
        console.log('\n********** Employees ***********')
        console.table(rows);
    }).catch(console.log)
    promptUser();
};

addEmployee = (rolesArray) => {
    inquirer.prompt([
        {
            type:'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: rolesArray
        }
    ])
    .then(answers => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id)
                    VALUES (?,?,(SELECT id FROM emp_role WHERE title = ?))`;
        const inputs = [answers.firstName, answers.lastName, answers.role];

        connection.promise().query(sql, inputs)
        .then( () => {
            console.log('New Employee Added')
            promptUser();
        })
    });
}

const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Exit']
        }
    ])
    .then((answers) => {
        const {choices} = answers;

        if (choices === 'View All Employees') {
            showEmployees();
        }
        if (choices === 'Add Employee') {
            let rolesArray = [];

            connection.promise().query(`SELECT title FROM emp_role`)
            .then(([rows, fields]) => {
                for (let i = 0; i < rows.length; i++) {
                    rolesArray.push(rows[i].title);
                }
                return rolesArray
            })
            .then(rolesArray =>  addEmployee(rolesArray));
           
        }
    })
}
