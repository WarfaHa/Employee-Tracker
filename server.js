const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
require('dotenv').config()

const connection = mysql.createConnection({
host:"localhost",
user: "root",
database: "employee_db",
password: process.env.DB_PASSWORD
})

connection.connect(function(err){
if (err){
  throw err;
}
console.log("Connected to Database");
// Function call to initialize app
init();
})

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
      default: connection.end();
        // Maybe later on, add Delete departments, roles, and employees.
      }
    });
}

function viewDept() {
connection.query("Select * From department", function(err, results){
if(err){
  throw err;
}
console.table(results);
init();
})

}
