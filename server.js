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
    })
}

 showEmployees = () => {
    connection.promise().query('SELECT * FROM employee')
    .then (([rows, fields]) => {
        console.table(rows);
    }).catch(console.log)
    promptUser();
};
