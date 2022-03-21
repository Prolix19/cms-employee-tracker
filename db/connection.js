// Pull in required package mysql2
const mysql = require("mysql2");

// Connect to my local MySQL database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "m1AUMjwrV33sHmt!",
        database: "employeetracker"
});

module.exports = db;