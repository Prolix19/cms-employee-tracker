// Bringing in required module, plus Figlet to imitate the Challenge 12 demo, just for fun
// Also database connectivity and DB functions
const inquirer = require("Inquirer");
const figlet = require("figlet");
const {db, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployee} = require("./db");

// Set up main menu choices so I can display the strings and switch on which prompt was chosen
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

// Get a selection from the user
const mainMenu = () => {
    inquirer.prompt({
        type: "list",
        name: "choice",
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
            // The cases below run their function, waiting on a promise return
            // then invoke mainMenu() again to continue program exection until the user wants to quit
            case menuPrompt.viewAllDepartments:
                console.log("\n");
                viewAllDepartments().then(() => {
                    mainMenu();
                });
                break;
            case menuPrompt.viewAllRoles:
                console.log("\n");
                viewAllRoles().then(() => {
                    mainMenu();
                });
                break;
            case menuPrompt.viewAllEmployees:
                console.log("\n");
                viewAllEmployees().then(() => {
                    mainMenu();
                });
                break;
            case menuPrompt.addDepartment:
                console.log("\n");
                addDepartment().then(() => {
                    mainMenu();
                });
                break;
            // The cases below here run functions with nested callbacks
            // Pass in mainMenu() so we can invoke it again within the called funcs
            case menuPrompt.addRole:
                console.log("\n");
                addRole(mainMenu);
                break;
            case menuPrompt.addEmployee:
                addEmployee(mainMenu);
                break;
            case menuPrompt.updateEmployeeRole:
                updateEmployee(mainMenu);
                break;
            // This case will end program execution
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