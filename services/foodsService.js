//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of foods
exports.getFoods = async () => {
    return await db.foods.findAll();
}

//Return the food by its id
exports.getFoodById = async (id) => {
    return await db.foods.findOne({
        where: {
            id
        }
    });
}