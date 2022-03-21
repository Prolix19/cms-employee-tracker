// Getting required packages Inquirer and console.table
// and bring in DB connection
const cTable = require("console.table");
const inquirer = require("Inquirer");
const db = require("./connection");

// Function to view all departments
const viewAllDepartments = () => {
  // Declare query to execute
  const query = `SELECT * FROM department`;

  // Enveloping query in a Promise
  return new Promise((resolve, reject) => {
    // Get all department columns
    db.query(query, (err, res) => {
      // If unsuccessful, don't fulfill the promise
      if (err) {
        reject(err);
        return;
      }
      // Else, use console.table to format the returned results
      resolve(
        {
          ok: true,
          message: "\n",
        },
        console.table(res)
      );
    });
  });
};

// Similar to above: declare SQL statement, use a promise to query & provide results
const viewAllRoles = () => {
  // Joining department so I can get the department name as a string, rather than showing a department ID number
  // This mimics the Challenge 12 demo's behavior
  const query = `SELECT role.id, title, department.name AS department, salary FROM role LEFT JOIN department ON role.department_id = department.id`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        {
          ok: true,
          message: "\n",
        },
        console.table(res)
      );
    });
  });
};

// Same story with this function to view all employees
const viewAllEmployees = () => {
  // More complex query here so we can add role titles, department names, salaries, as shown in the demo
  // Also need to display manager as manager's name, not a manager_id number, so I perform some concatenation on
  // elements of the table joined to itself (with an alias of "m" for manager)
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON (employee.manager_id = m.id)`;

  return new Promise((resolve, reject) => {
    db.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        {
          ok: true,
          message: "\n",
        },
        console.table(res)
      );
    });
  });
};

const addDepartment = () => {
  return new Promise((resolve, reject) => {
    // Using Inquirer to get the new department's name
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "What is the name of the department?",
          validate: (departmentName) => {
            if (departmentName) {
              return true;
            } else {
              console.log(
                "\nPlease enter a department name before continuing."
              );
              return false;
            }
          },
        },
      ])
      // Then pass the name into the .then callback
      .then(({ departmentName }) => {
        const query = `INSERT INTO department (name) VALUES ("${departmentName}")`;
        db.query(query, (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          // Once the query finishes, the promise will finally return
          resolve(
            {
              ok: true,
              message: "\n",
            },
            console.log("Added " + departmentName + " to the database.\n")
          );
        });
      });
  });
};

// Function to add a role; using nested callbacks for this rather than promises
const addRole = (mainMenu) => {
  // Get department list from DB as department info will be needed later
  db.query(`SELECT * FROM department`, (err, allDepartments) => {
    if (err) {
      console.log(err);
      mainMenu();
    }

    // Form an array of only department names from the query's return (IDs and names) so Inquirer can show only names to the user
    const departmentArray = [];
    allDepartments.forEach((department) => {
    departmentArray.push(department.name);
  });

  // Prompt user for input defining the new role
  inquirer.prompt([
      {
        type: "input",
        name: "roleName",
        message: "What is the name of the role?",
        // Error check that they actually entered something
        validate: (roleName) => {
          if (roleName) {
            return true;
          } else {
            console.log("\nPlease enter a role name before continuing.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the role?",
        validate: (roleSalary) => {
          if (roleSalary) {
            return true;
          } else {
            console.log(
              "\nPlease enter a salary for the role before continuing."
            );
            return false;
          }
        },
      },
      {
        type: "list",
        name: "roleDepartment",
        message: "Which department does the role belong to?",
        // Here we use the array formed previously to let them pick from department names
        choices: departmentArray
      },
    ])
    .then(({ roleName, roleSalary, roleDepartment }) => {
      // Find which department ID number was chosen by comparing the name to the name from the DB results, and, on a match,
      // storing that match's department ID to a variable we can feed into our query string
      let departmentID = allDepartments.find((department, index) => {
          if(department.name === roleDepartment) {
              return true;
          }
      }).id;

      // Build out the query string with two responses from Inquirer and the department ID determined above
      const query = `INSERT INTO role (title, salary, department_id) VALUES ("${roleName}", ${roleSalary}, ${departmentID})`;
      // Execute the query and call main menu again following an error or success, so app execution continues
      db.query(query, (err, res) => {
        if (err) {
          console.log(err);
          mainMenu();
        }
        console.log("Added " + roleName + " to the database.\n");
          mainMenu();
      });
    });
  });
};

// Employee add function, quite similar to the role add one above
const addEmployee = (mainMenu) => {
  // Get role list from DB for displaying it later
  db.query(`SELECT * FROM role`, (err, allRoles) => {
    if (err) {
      console.log(err);
      mainMenu();
    }

    // Save just the role titles (no other columns) so Inquirer can display them easily
    const roleArray = [];
    allRoles.forEach((role) => {
    roleArray.push(role.title);
    });

    // Get employee list from DB for later use as well
    db.query(`SELECT * FROM employee`, (err, allEmployees) => {
      if(err) {
        console.log(err);
        mainMenu();
      }

      // The employee list will be used so we can select a manager (from the employee list) for the
      // new employee being added. However, it needs to be possible for the user to choose that the
      // new employee does not have a manager. Therefore, we'll build the "None" option into the
      // array of employee names before completing it with names from the DB results
      const employeeArray = ["None"];
      allEmployees.forEach((employee) => {
        employeeArray.push(employee.first_name + " " + employee.last_name);
      });

      // Prompt user for input on the new employee
      inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
          validate: (firstName) => { // Error checking again
            if (firstName) {
              return true;
            } else {
              console.log("\nPlease enter the employee's first name before continuing.");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
          validate: (lastName) => {
            if (lastName) {
              return true;
            } else {
              console.log(
                "\nPlease enter the employee's last name before continuing."
              );
              return false;
            }
          },
        },
        {
          type: "list",
          name: "employeeRole",
          message: "What is the employee's role?",
          choices: roleArray // Presents plain English role names to the user, instead of numeric IDs
        },
        {
          type: "list",
          name: "employeeManager",
          message: "Who is the employee's manager?",
          choices: employeeArray // Presents an option for no manager, plus every existing employee's full name
        }
      ]).then(({firstName, lastName, employeeRole, employeeManager}) => {

        // Now that Inquirer has finished up, determine the role ID from the role's name, and store it for our query
        let roleID = allRoles.find((role, index) => {
          if(role.title === employeeRole) {
              return true;
          }
        }).id;

        // If this new employee will not have a manager (user chose "None" option from Inquirer prompt), then my string literal needs to
        // be different and include the text NULL hard-coded, because JS won't let me insert a variable that === NULL
        // using the typical ${variable} operation -- JS doesn't realize I want to insert a string containing "NULL"
        if(employeeManager == "None") {
          const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleID}, NULL)`;
          db.query(query, (err, res) => {
            // Finally, re-call mainMenu() after dealing with the results
            if (err) {
              console.log(err);
              mainMenu();
            }
            console.log("Added " + firstName + " " + lastName + " to the database.\n");
              mainMenu();
            });
        } else { // Otherwise, this employee WILL have a manager, and the SQL statement will need to be different

          // Find the manager ID number from the name chosen by the user, then store it for insertion into our string literal
          let managerID = allEmployees.find((manager, index) => {
            if((manager.first_name + " " + manager.last_name) == employeeManager) {
              return true;
            }
          }).id;

          // Form the query using results from Inquirer, the role ID determined, and the manager ID determined
          const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleID}, ${managerID})`;
          db.query(query, (err, res) => {
            if (err) {
              console.log(err);
              mainMenu();
            }
            console.log("Added " + firstName + " " + lastName + " to the database.\n");
              mainMenu();
          });
        };
      });
    });
  });
};

const updateEmployee = (mainMenu) => {
    // Get role list from DB for displaying it later
    db.query(`SELECT * FROM role`, (err, allRoles) => {
      if (err) {
        console.log(err);
        mainMenu();
      }
  
    const roleArray = [];
    allRoles.forEach((role) => {
    roleArray.push(role.title);
    });
  
    // Also need the list of employees again
    db.query(`SELECT * FROM employee`, (err, allEmployees) => {
      if(err) {
        console.log(err);
        mainMenu();
      }

      const employeeArray = [];
      allEmployees.forEach((employee) => {
        employeeArray.push(employee.first_name + " " + employee.last_name);
      });

      // Prompt user for input on the new role
      inquirer.prompt([
        {
          type: "list",
          name: "employeeName",
          message: "Which employee's role do you want to update?",
          choices: employeeArray
        },
        {
          type: "list",
          name: "newRole",
          message: "Which role do you want to assign the selected employee?",
          choices: roleArray
        }
      ]).then(({employeeName, newRole}) => {

        // Find role ID based off role name chosen
        let roleID = allRoles.find((role, index) => {
        if(role.title === newRole) {
            return true;
        }}).id;

        // Find employee ID based off employee name chosen
        let employeeID = allEmployees.find((employee, index) => {
          if((employee.first_name + " " + employee.last_name) == employeeName) {
            return true;
          }
        }).id;

        // Form our query string
        const query = `UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`;

        db.query(query, (err, res) => {
          if (err) {
            console.log(err);
            mainMenu();
          }
          console.log("Updated employee's role.\n");
          mainMenu();
        });
      });
    });
  });
};

module.exports = {db, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployee};