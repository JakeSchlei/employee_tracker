const sql = require('mysql2');
const inquirer = require('inquirer');





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