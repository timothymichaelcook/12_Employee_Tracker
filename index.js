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

db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to employees_DB database.`);
  init();
});

// Function to initialize the application
function init() {
  inquirer.prompt({
    type: 'list',
    message: 'Please choose: ',
    name: 'start',
    choices: [
      'View all employees',
      'View all roles',
      'View all departments',
      'Add employee',
      'Add role',
      'Add department',
      'Update employee role',
      'Quit',
    ],
  })
  .then((answers) => {
    switch (answers.start) {
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all departments':
        viewDepartments();
        break; 
      case 'Add employee':
        addEmployee();
        break;
      case 'Add roles':
        addRole();
        break;
      case 'Add department':
        addDepartment();
        break;
      case 'Update employee role':
        updateEmployeeRole();
        break;
      case 'Quit':
        db.end();
        break;
    }
  });
}

// Function to view departments*
function viewDepartments() {
  let query = 'SELECT * FROM department';
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

// Function to view roles*
function viewRoles() {
  let query = 'SELECT * FROM role';
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

// Function to view employees*
function viewAllEmployees() {
  let query = `
  SELECT e.id, e.first_name, e.last_name, r.title, d.name
  AS department, r.salary, CONCAT(m.first_name,' ',m.last_name)
  AS manager
  FROM employee e
  LEFT JOIN role r ON e.role_id = r.id
  LEFT JOIN department d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id
  `
  db.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    init();
  })
}

// Function to add employee
function addEmployee() {
  let query = 'SELECT * FROM role';
  db.query(query, function (err, result) {
    if (err) throw err;
    let allRoles = ['none'];
    for (let i=0; i < result.length; i++) {
      let eachRole = result[i].title;
      allRoles.push(eachRole);
    }
    let query = 'SELECT * FROM employee';
    db.query(query, function (err, result1) {
      if (err) throw err;
      let allEmployees = ['none',];
      for (let i = 0; i < result1.length; i++) {
        let eachEmployee = result1[i].first_name + result1[2].last_name;
        allEmployees.push(eachEmployee);
      }
      inquirer.prompt([
        {
          name: 'first_name',
          type: 'input',
          message: 'Please enter first name of employee:',
          validate: input => {
            if (input.trim() != '') {
              return true;
            }
            return '(Cannot be blank) Please enter employee\'s first name:'
          }
        },
        {
          name: 'last_name',
          type: 'input',
          message: 'Please enter last name of employee:',
          validate: input => {
            if (input.trim() != '') {
              return true;
            }
            return '(Cannot be blank) Please enter employee\'s last name:'
          }
        },
        {
          name: 'role_id',
          type: 'list',
          message: 'Please enter employee\'s role: ',
          choices: [...allRoles] 
        },
        {
          name: 'manager_id',
          type: 'list',
          message: 'Please enter employee\'s manager: ',
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
        let manager_id  = '';
        for (i = 0; i < result1.length; i++) {
          if (answer.manager_id === result1[i].first_name + result1[i].last_name) {
            manager_id = result1[i].id;
          } else if (answer.manager_id === 'none') {
            manager_id = null;
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
// Function to add roles
function addRole() {
  let query = 'SELECT * FROM department';
  db.query(query, function (err, result) {
    if (err) throw err;
    let allDepartments = [];
    for (let i = 0; i < result.length; i++) {
      let individualDepartment = result[i].name;
      allDepartments.push(individualDepartment);
    }

    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Please choose a role:',
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
        message: 'Please choose a salary:',
        validate: input => {
          if (!isNaN(input)) {
            return true;
          }
          return '(Cannot be blank or contain letters/special characters) Please choose a salary you would like to add: '
        }
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Please choose a role for the new department: ',
        choices: [...allDepartments]
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
          console.log(`${answer.title} in ${answer.department_id} department for $ ${answer.salary} has been created.\n`);
          init();
        }
      );
    });
  })
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
  .then(function (answer) {
    let query = db.query(
      'INSERT INTO department SET ?',
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

// Function to update employee roles*
function updateEmployeeRole() {
  let query = 'SELECT * FROM role';
  db.query(query, function (err, result) {
    if (err) throw err;
    let allRoles = ['none'];
    for (let i = 0; i < result.length; i++) {
      let eachRole = result[i].title;
      allRoles.push(eachRole);
    }
    let query = 'SELECT * FROM employee';
    db.query(query, function (err, result1) {
      if (err) throw err;
      let allEmployees = [{name: 'none', value: -1},];
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
          [role_id, answer.employee],
          function (err, res) {
            if (err) throw err;
            console.log(`Employee's role has been updated.`);
            init();
          }
        );
      });
    })
  })
}

