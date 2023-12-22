//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of ingredients
exports.getIngredients = async () => {
    return await db.ingredients.findAll();
}

//Add a ingredients
exports.addIngredients = (name, price) => {
    return db.ingredient.create({
        name,
        price
    });
}

//Return the ingredients by its id
exports.getIngredientsById = async (id) => {
    return await db.ingredient.findOne({
        where: {
            id
        }
    });
}
//Delete the food by its id
exports.deleteIngredientsById = (id) => {
    return db.ingredient.destroy({
        where: {
            id
        }
    });
}

//Update the food by its id
exports.updateIngredientById = async (id, name, price) => {
    return await db.ingredient.update({
        name,
        price
    }, 
    { where: {
            id
        }
    });
}