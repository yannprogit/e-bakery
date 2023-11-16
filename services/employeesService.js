//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------
//Return the list of employees
exports.getEmployees = async () => {
    return await db.employees.findAll();
}

//Get the name of employee's role 
exports.getRole = async (id) => {
    const role = await db.roles.findOne({
        attributes: ['name'],
        where: {id: id}
    });

    return role.name;
}