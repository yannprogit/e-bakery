//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of purchases
exports.getPurchases = async () => {
    return await db.buy.findAll();
}