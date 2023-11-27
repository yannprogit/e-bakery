//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of foods
exports.getFoods = async () => {
    return await db.foods.findAll();
}