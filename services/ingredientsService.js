//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of ingredients
exports.getIngredients = async () => {
    return await db.ingredients.findAll();
}

//Add an ingredient
exports.addIngredient = (name, stock) => {
    return db.ingredients.create({
        name,
        stock
    });
}

//Return the ingredient by its id
exports.getIngredientById = async (id) => {
    return await db.ingredients.findOne({
        where: {
            id
        }
    });
}

//Delete the ingredient by its id
exports.deleteIngredientById = (id) => {
    return db.ingredients.destroy({
        where: {
            id
        }
    });
}

//Update the ingredient by its id
exports.updateIngredientById = async (id, name, stock) => {
    return await db.ingredients.update({
        name,
        stock
    }, 
    { where: {
            id
        }
    });
}