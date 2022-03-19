// Bringing in required modules, packages
const inquirer = require("Inquirer");
const consoleTable = require("console.table");
const figlet = require("figlet");
// Database connectivity to local MySQL service
const db = require("./db");

// Using Figlet to imitate the Challenge 12 demo as best as possible, just for fun
const showNiceTitleArt = (title) => {
    figlet(title, (err, data) => {
        if (err) {
            console.log("Error displaying application title.");
            return;
        } else {
            console.log(data);
        }
    });
};

const mainMenu = () => {
    // Do stuff
    // inquirer.prompt(
    //     [
    //         {
    //             type: input,
    //             name: name,
    //             message: "What would you like to do?"
    //         }
    //     ]
    // );
};

const init = () => {
    // Establish connection to MySQL
    db.connect(err => {
        if (err) {
            throw err;
        } else {
            // Call Figlet title ASCII art just once
            showNiceTitleArt("Employee");
            showNiceTitleArt("Manager");
            // Then dive into the menu for the user
            mainMenu();
        }
    });
};

// Run the app
init();