const mysql = require("mysql2/promise");
const db = require("./connection");
const cTable = require("console.table");

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
//     db.query(query, (err, res) => {
//         if(err) {
//             throw err;
//         } else {
//             console.log("\n");
//             console.table(res);
//         }
//     });
// };

module.exports = {db, viewAllDepartments};