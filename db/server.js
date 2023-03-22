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
      ''
    ]
  })

}

// Function to add department

// Function to add roles

// Function to add employees

// Function to view departments

// Function to view roles

// Function to view employees

// Function to view employee's based on manager id

// Function to update employee roles

// Function to update employee's manager

// Function to delete departments

// Function to delete roles

// Function to delete employees

