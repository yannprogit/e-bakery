//------------- Import -------------
const { getEmployees } = require('./services/employeesService.js');

//------------- Methods -------------
//Get the list of employees
exports.getEmployees = (req, res) => {
    res.json(getEmployees()).send();
}