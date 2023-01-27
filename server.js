const { promisify } = require("util");
const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { connect } = require("http2");
const { get } = require("http");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "employee_db",
  password: process.env.DB_PASSWORD,
});

connection.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Connected to Database");
  // Function call to initialize app
  init();
});

const query = promisify(connection.query).bind(connection);

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "databaseOptions",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then(function (userInput) {
      // console.log(userInput.databaseOptions);
      // switch - case into other functions such as addDept() or addRole
      switch (userInput.databaseOptions) {
        case "View All Departments":
          viewDept();
          break;
        case "View All Roles":
          viewRole();
          break;
        case "View All Employees":
          viewEmp();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        default:
          connection.end();
        // Maybe later on, add Delete departments, roles, and employees.
      }
    });
}

function viewDept() {
  connection.query("Select * From department", function (err, results) {
    if (err) {
      throw err;
    }
    console.table(results);
    init();
  });
}

function viewEmp() {
  connection.query("Select * From employee", function (err, results) {
    if (err) {
      throw err;
    }
    console.table(results);
    init();
  });
}

function viewRole() {
  connection.query("Select * From role", function (err, results) {
    if (err) {
      throw err;
    }
    console.table(results);
    init();
  });
}

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department would you like to add?",
      },
    ])
    .then(function (userInput) {
      connection.query(
        "INSERT INTO department SET ?",
        { name: userInput.addDept },
        function (err, results) {
          if (err) {
            throw err;
          }
          console.table(results);
          init();
        }
      );
    });
}

function addEmp() {
  getManagers()
    .then((managers) => {
      return getRoles().then((roles) => {
        return { managers, roles };
      });
    })
    .then(({managers, roles}) =>
      inquirer.prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the first name of new employee?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the last name of new employee?",
        },
        {
          type: "list",
          name: "role_id",
          message: "What is the role of new employee?",
          choices: roles,
        },
        {
          type: "list",
          name: "manager_id",
          message: "Who is the manager of new employee?",
          choices: managers,
        },
      ])
    )
    .then(function (userInput) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: userInput.first_name,
          last_name: userInput.last_name,
          role_id: userInput.role_id,
          manager_id: userInput.manager_id,
        },
        function (err, results) {
          if (err) {
            throw err;
          }
          console.table(results);
          init();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What role would you like to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?",
      },
    ])
    .then(function (userInput) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: userInput.title,
          salary: userInput.salary,
        },
        function (err, results) {
          if (err) {
            throw err;
          }
          console.table(results);
          init();
        }
      );
    });
}

function updateRole() {
  getEmployees()
    .then((employees) => {
      return getRoles().then((roles) => {
        return { employees, roles };
      });
    })
    .then(({employees, roles}) =>
 inquirer
   .prompt([
     {
       type: "list",
       name: "employeeOptions",
       message: "Which employee would you like to update?",
       choices: employees
     },
     {
       type: "list",
       name: "newTitle",
       message: "What is the new role would you like to update to?",
       choices: roles
     },
     {
       type: "input",
       name: "newSalary",
       message: "What is the new salary of this role?"
     },
   ])).then(function (userInput) {
       connection.query(
         "INSERT INTO role SET ?",
         {
           title: userInput.newTitle,
           salary: userInput.newSalary,
           //department_id: userInput.department_id
         },
 function (err, results) {
   if (err) {
     throw err;
   }
   console.table(results);
   init();
 }
);
});
}

// changes roles from integer id to actual value
async function getRoles() {
  const data = await query("SELECT id, title FROM role");
  return data.map(({ id, title }) => ({ value: id, name: title }));
}

// changes managers from integer id to actual value
async function getManagers() {
  const data = await query(
    "SELECT m.id, m.first_name, m.last_name FROM employee as m INNER JOIN employee as e ON m.id = e.manager_id"
  );
  return data.map(({ id, first_name, last_name }) => ({
    value: id,
    name: `${first_name} ${last_name}`,
  }));
}

// changes employees from integer id to actual value
async function getEmployees() {
  const data = await query("SELECT id, first_name, last_name FROM employee");
  return data.map(({ id, first_name, last_name }) => ({
    value: id,
    name: `${first_name} ${last_name}`,
  }));
}