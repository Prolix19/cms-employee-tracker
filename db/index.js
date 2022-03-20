const db = require("./connection");
const cTable = require("console.table");
const inquirer = require("Inquirer");
const departmentArray = [];
const departmentNameArray = [];

async function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if(err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: "\n",
            }, console.table(res));
        });
    });
};

async function viewAllRoles() {
    const query = `SELECT role.id, title, department.name AS department, salary FROM role LEFT JOIN department ON role.department_id = department.id`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if(err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: "\n",
            }, console.table(res));
        });
    });
};

async function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON (employee.manager_id = m.id)`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, res) => {
            if(err) {
                reject(err);
                return;
            }
            resolve({
                ok: true,
                message: "\n"
            }, console.table(res));
        });
    });
};

async function addDepartment() {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What is the name of the department?",
                validate: departmentName => {
                    if(departmentName) {
                        return true;
                    } else {
                        console.log("\nPlease enter a department name before continuing.");
                        return false;
                    }
                }
            }
        ]).then(({departmentName}) => {
            const query = `INSERT INTO department (name) VALUES ("${departmentName}")`;
            db.query(query, (err, res) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve({
                    ok: true,
                    message: "\n"
                }, console.log("Added " + departmentName + " to the database.\n"));
            });
        });
    });
};

async function addRole() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM department`, (err, res) => {
            if(err) {
                reject(err);
                return;
            }
            resolve(res);
        });
    }) // End 1st promise
    .then(res => {
        res.forEach(e => {
            departmentArray.push(e);
        });
        departmentArray.forEach(e => {
            departmentNameArray.push(e.name);
        });
        return new Promise((resolve, reject) => {
            inquirer.prompt([
                {
                    type: "input",
                    name: "roleName",
                    message: "What is the name of the role?",
                    validate: roleName => {
                        if(roleName) {
                            return true;
                        } else {
                            console.log("\nPlease enter a role name before continuing.");
                            return false;
                        }
                    }
                },
                {
                    type: "input",
                    name: "roleSalary",
                    message: "What is the salary of the role?",
                    validate: roleSalary => {
                        if(roleSalary) {
                            return true;
                        } else {
                            console.log("\nPlease enter a salary for the role before continuing.");
                            return false;
                        }
                    }
                },
                {
                    type: "list",
                    name: "roleDepartment",
                    message: "Which department does the role belong to?",
                    choices: departmentNameArray
                }
            ]) // End of inqurirer, second Promise
            .then(({roleName, roleSalary, roleDepartment}) => {
                let departmentID = 0;
                departmentArray.forEach(e => {
                    if(e.name == roleDepartment) {
                        departmentID = e.id;
                    }
                });
                return new Promise((resolve, reject) => {
                    const query = `INSERT INTO role (title, salary, department_id) VALUES ("${roleName}", "${roleSalary}", ${departmentID})`;
                    db.query(query, (err, res) => {
                        if(err) {
                            reject(err);
                            return;
                        }
                        resolve({
                            ok: true,
                            message: "\n"
                        }, console.log("Added " + roleName + " to the database.\n"));
                    });
                }); // End of third Promise
            }); // End of second .then
        }); 
    }); // End of first .then
};

module.exports = {db, viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole};