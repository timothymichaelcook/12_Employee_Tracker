// Declare and assign global variables
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '%Kdd0YuK2sztEJL8',
    database: 'employees_DB'
  },
);

db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employees_DB database.`);
  init();
});

// Function to start application

function init() {
  inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'start',
    choices: [
      'Add department',
      'Add roles',
      'Add employees',
      'View departments',
      'View roles',
      'View employees',
      'Update employee roles',
      'Update employee\'s manager',
      'View employee\s by manager',
      'Delete departments',
      'Delete roles',
      'Delete employees',
      'Exit',
    ],
  })
  .then((choice) => {
    switch (choice.start) {
      case 'Add departments':
        addDepartment();
        break;
      case 'Add roles':
        addRole();
        break;
      case 'Add employees':
        addEmployee();
        break;
      case 'View departments':
        viewDepartments();

    }
  })

}

// Function to add department
function addDepartment()

// Function to add roles
function addRole()

// Function to add employees
function addEmployee()

// Function to view departments
function viewDepartments()

// Function to view roles
function viewRoles()

// Function to view employees
function viewEmployees()

// Function to view employee's based on manager id
function viewEmployeesByManager()

// Function to update employee roles
function updateEmployeeRoles()

// Function to update employee's manager
function updateEmployeeManager()

// Function to delete departments
function deleteDepartments()

// Function to delete roles
function deleteRoles()

// Function to delete employees
function deleteEmployees()
