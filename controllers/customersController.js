//------------- Import -------------
const { getCustomers } = require('../services/customersService.js');

//------------- Methods -------------
//Get the list of employees
exports.getCustomers = async (req, res) => {
    const customers = await getCustomers();
    res.json({success: true, data: customers});
}