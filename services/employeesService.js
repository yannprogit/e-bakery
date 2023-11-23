const employeeModel = require('./models/employeesModel.js');



//------------- Methods -------------

//Return the list of employees
exports.getEmployees = async () => {
    return await employeeModel.employees.findAll();
}