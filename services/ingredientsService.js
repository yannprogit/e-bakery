//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of ingredients
exports.getIngredients = async () => {
    return await db.ingredients.findAll();
}

//Add an ingredient
exports.addIngredient = (name, stock) => {
    if (stock < 0){
        return false;
    }
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
    db.contain.destroy({
        where: {
            ingredientId: id
        }
    });

    return db.ingredients.destroy({
        where: {
            id
        }
    });
}

//Update the ingredient by its id
exports.updateIngredientById = async (id, name, addStock) => {
    if (addStock < 0){
        return false;
    }

    const ingredient = await db.ingredients.findOne({
        where: {
            id
        }
    });

    let addedStock = ingredient.stock + addStock;
    return await db.ingredients.update({
        name,
        stock: addedStock
    }, 
    { where: {
            id
        }
    });
}