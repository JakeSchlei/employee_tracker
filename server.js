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
    if(err) throw err;
    welcomeMessage();
});

const style1 = [
  'color: powderBlue',
  'text-shadow: 2px 2px purple', 
  'background: plum', 
  'font-size: 3em',
  'border: 1px solid purple',
  'padding: 20px',
  'font-family: fantasy'
].join(';');

welcomeMessage = () => {
    console.log('%cEmployee Tracker!', style1);
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