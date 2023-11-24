//------------- Import -------------
const { getCustomers } = require('../services/customersService.js');

//------------- Methods -------------
//Get the list of employees
exports.getCustomers = (req, res) => {
    res.json({success: true, data: getCustomers()});
}