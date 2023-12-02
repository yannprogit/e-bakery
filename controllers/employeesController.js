//------------- Import -------------
const { getEmployees, getEmployeesByRole } = require('../services/employeesService.js');

//------------- Methods -------------
//Get the list of employees
exports.getEmployees = async (req, res) => {
    const employees = await getEmployees();
    res.json({success: true, data: employees});
}

//Get the list of employees by their role
exports.getEmployeesByRole = async (req, res, id) => {
    const employees = await getEmployeesByRole(id);
    res.json({success: true, data: employees});
}