// View all departments
// view all roles
// view all employees
// add a department
// add a role
// add an employee
// update an employee role

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

// Bringing in required modules, packages
const inquirer = require("Inquirer");
//const cTable = require("console.table");
// Using Figlet to imitate the Challenge 12 demo as best as possible, just for fun
const figlet = require("figlet");
// Database connectivity to local MySQL service
const {db, viewAllDepartments} = require("./db");

const menuPrompt = {
    viewAllDepartments: "View All Departments",
    viewAllRoles: "View All Roles",
    viewAllEmployees: "View All Employees",
    addDepartment: "Add Department",
    addRole: "Add Role",
    addEmployee: "Add Employee",
    updateEmployeeRole: "Update Employee Role",
    quit: "Quit"
}

const mainMenu = () => {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: [
            menuPrompt.viewAllDepartments,
            menuPrompt.viewAllRoles,
            menuPrompt.viewAllEmployees,
            menuPrompt.addDepartment,
            menuPrompt.addRole,
            menuPrompt.addEmployee,
            menuPrompt.updateEmployeeRole,
            menuPrompt.quit
        ]
    }).then((response) => {
        switch(response.choice) {
            case menuPrompt.viewAllDepartments:
                console.log("\n");
                viewAllDepartments().then(() => {
                    mainMenu();
                });
                break;
            case menuPrompt.viewAllRoles:
                console.log("View all roles func");
                break;
            case menuPrompt.viewAllEmployees:
                console.log("View all employees func");
                break;
            case menuPrompt.addDepartment:
                console.log("Add dept func");
                break;
            case menuPrompt.addRole:
                console.log("Add role func");
                break;
            case menuPrompt.addEmployee:
                console.log("Add employee func");
                break;
            case menuPrompt.updateEmployeeRole:
                console.log("Update employee role func");
                break;
            case menuPrompt.quit:
                db.end();
                break;
        }
    });
};

const init = () => {
    // Establish connection to MySQL
    db.connect(err => {
        if (err) {
            throw err;
        } else {
            // Call Figlet title ASCII art just once
            console.log(figlet.textSync("Employee"));
            console.log(figlet.textSync("Manager"));
            // Then dive into the menu for the user
            mainMenu();
        }
    });
};

// Run the app
init();