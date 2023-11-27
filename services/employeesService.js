//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of employees
exports.getEmployees = async () => {
    return await db.employees.findAll();
}