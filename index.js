// Declare and assign global variables
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '%Kdd0YuK2sztEJL8',
    database: 'employees_DB',
  }
);

//testing commit

db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the employees_DB database.`);
  init();
});

// Function to initialize application
function init() {
  inquirer.prompt({
    type: 'list',
    message: 'What would you like to do?',
    name: 'start',
    choices: [
      'View all employees',
      'Add employee',
      'Update employee role',
      'View all roles',
      'Add roles',
      'View all departments',
      'Add department',
      'Quit',
    ],
  })
  .then((choice) => {
    switch (choice.start) {
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add employee':
        addEmployee();
        break;
      case 'Update employee role':
        updateEmployeeRole();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'Add roles':
        addRole();
        break;
      case 'View all departments':
        viewDepartments();
        break; 
      case 'Add department':
        addDepartment();
        break;
      case 'Quit':
        db.end();
        break;
    }
  });
}

// Function to add department*
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
  .then(function (answer) {
    let query = db.query(
      'INSET INTO department SET ?',
      {
        name: answer.addDepartment,
      },
      function (err, res) {
        if (err) throw err;
        console.log('Department: ' + answer.addDepartment + ' has been created ');
        init();
      }
    );
  });
}

// Function to add roles*
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
    .then(function (answer) {
      let department_id = '';
      for (i = 0; i < answer.length; i++) {
        if (answer.department_id === result[i].name) {
          department_id = result[i].id;
        }
      }
      let query = db.query('INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: department_id,
        },
        function (err, res) {
          if (err) throw err;
          console.log(`${answer.title} in ${answer.department_id} department for $${answer} has been created.`);
          init();
        }
      );
    });
  })
}

// Function to add employee*
function addEmployee() {
  let query = 'SELECT * FROM role';
  db.query(query, function (err, result) {
    if (err) throw err;
    let allRoles = ['Empty']
    for (let i=0; i < result.length; i++) {
      let eachRole = result[i].title;
      allRoles.push(eachRole);
    }
    let query = 'SELECT * FROM employee';
    db.query(query, function (err, result1) {
      if (err) throw err;
      let allEmployees = ['none',];
      for (let i=0; i < result1.length; i++) {
        let eachEmployee = result1[i].first_name + result[2].last_name;
        allEmployees.push(eachEmployee);
      }
      inquirer.prompt([
        {
          name: 'first_name',
          type: 'input',
          message: 'Please enter employee\s first name: ',
          validate: input => {
            if (input.trim() != '') {
              return true;
            }
            return '(Cannot be blank) Please enter employee\s first name: '
          }
        },
        {
          name: 'role_id',
          type: 'list',
          message: 'Please enter employee\s role: ',
          choices: [...allRoles] 
        },
        {
          name: 'manager_id',
          type: 'list',
          message: 'Please enter employee\s manager: ',
          choices: [...allEmployees]
        }
      ])
      .then(function (answer) {
        console.log(answer);

        let role_id = '';
        for (i = 0; i < result.length; i++) {
          if (answer.role_id === result[i].title) {
            role_id = result[i].id;
          }
        }
        let query = db.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: role_id,
            manager_id: manager_id 
          },
          function (err, res) {
            if (err) throw err;
            console.log(`Employee ${answer.first_name} ${answer.last_name} has been created.`);
            init();
          }
        );
      });
    })
  })
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
function viewAllRoles() {
  let query = 'SELECT * FROM role';
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

// Function to view employees
function viewAllEmployees() {
  let query = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
  AS department, role.salary, CONCAT(manager.first_name,' ',manager.last_name)
  AS manager
  FROM employee
  LEFT JOIN role ON employee_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee ON employee.manager_id = manager.id
  `
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

// Function to update employee roles*
function updateEmployeeRole() {
  let query = 'SELECT * FROM role';
  db.query(query, function (err, result) {
    if (err) throw err;
    let allRoles = ['Empty'];
    for (let i = 0; i < result.length; i++) {
      let eachRole = result[i].title;
      allRoles.push(eachRole);
    }
    let query = 'SELECT * FROM employee';
    db.query(query, function (err, result1) {
      if (err) throw err;
      let allEmployees = [{name: 'Empty', value: -1},];
      for (let i = 0; i < result.length; i++) {
        let eachEmployee = result1[i].first_name + ' ' + result1[i].last_name;
        allEmployees.push({name: eachEmployee, value: result1[i].id});
      }
      inquirer.prompt([
        {
          name: 'employee',
          type: 'list',
          message: 'Please choose an employee that you would like to update his or her role: ',
          choices: [...allEmployees]
        },
        {
          name: 'role',
          type: 'list',
          message: 'Please choose a new role: ',
          choices: [...allRoles]
        },
      ])
      .then(function (answer) {
        let role_id = '';
        for (i = 0; i < result.length; i++) {
          if (answer.role === result[i].title) {
            role_id = result[i].id;
          }
        }
        let query = db.query(
          'UPDATE employee SET role_id = ? WHERE id = ?',
          [role_id, answer.addEmployee],
          function (err, res) {
            if (err) throw err,
            console.log(`Employee's role has been updated.`);
            init();
          }
        );
      });
    })
  })
}

