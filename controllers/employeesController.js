//------------- Import -------------
const { getEmployees } = require('../services/employeesService.js');

//------------- Methods -------------
//Get the list of employees
exports.getEmployees = async (req, res) => {
    const employees = await getEmployees();
    res.json({success: true, data: employees});
}