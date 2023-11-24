//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of customers
exports.getCustomers = async () => {
    return await db.customers.findAll();
}