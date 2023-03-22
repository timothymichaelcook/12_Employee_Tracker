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
        break;
      case 'View roles':
        viewRoles();
        break;
      //add additional cases with functions
      //
      //
      //
      //
      //
      //
      case 'Exit':
        db.end();
        break;
    }
  });
}

// Function to add department
function addDepartment() {
  inquirer.prompt({
    name: 'addDepartment',
    type: 'input',
    message: 'Please choose a department: ',
    validate: input => {
      if (input.trim() != '') {
        return true;
      }
      return '(Cannot be blank) Please choose a department: '
    }
  })
  .then(function (userSelection) {
    let query = db.query(
      'INSET INTO department SET ?',
      {
        name: userSelection.addDepartment,
      },
      function (err, res) {
        if (err) throw err;
        console.log('Department: ' + userSelection.addDepartment + ' has been created ');
        init();
      }
    );
  });
}

// Function to add roles
function addRole() {
  let query = 'SELECT * FROM department';
  db.query(query, function (err, result) {
    if (err) throw err;
    let totalDepartments = [];
    for (let i = 0; i < result.length; i++) {
      let individualDepartment = result[i].name;
      totalDepartments.push(individualDepartment);
    }

    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Please choose a role: ',
        validate: input => {
          if (input.trim() != '') {
            return true;
          }
          return '(Cannot be blank) Please choose a role: '
        }

      },
      {
        name: 'salary',
        type: 'input',
        message: 'Please choose a salary: ',
        validate: input => {
          if (!isNaN(input)) {
            return true;
          }
          return '(Cannot be blank or contain letters) Please choose a salary you would like to add: '
        }
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Please choose a role for the new department: ',
        choices: [...totalDepartments]
      }
    ])
    .then(function (userSelection) {
      let department_id = '';
      for (i = 0; i < userSelection.length; i++) {
        if (userSelection.department_id === result[i].name) {
          department_id = result[i].id;
        }
      }
      let query = db.query('INSERT INTO role SET ?'
        {
          title: userSelection.title,
          salary: userSelection.salary,
          department_id: department_id,
        },
        function (err, res) {
          if (err) throw err;
          console.log(`${userSelection.title} in ${userSelection.department_id} department for $${userSelection} has been created.`);
          init();
        }
      )
    })
  })
}

// Function to add employees
function addEmployee() {
  // Declare query variable locally in addEmployee
  // Set up db connection
  // NPM Inquirer to get user inputs via prompts
  // .then method
  // call init function again
}

// Function to view departments
function viewDepartments() {
  let query = 'SELECT * FROM department';
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

// Function to view roles
function viewRoles() {
  let query = 'SELECT * FROM role';
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

// Function to view employees
function viewEmployees() {
  let query = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
  AS department, role.salary, CONCAT(manager.first_name,' ',manager.last_name)
  AS manager
  FROM employee
  LEFT JOIN role r ON employee_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee ON employee.manager_id = manager.id
  `
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

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
