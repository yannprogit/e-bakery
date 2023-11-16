//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of ingredients
exports.getIngredients = async () => {
    return await db.ingredients.findAll();
}