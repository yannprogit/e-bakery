//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of compositions
exports.getCompositions = async () => {
    return await db.contain.findAll();
}

//Add a composition
exports.addContain = (foodId, ingredientId) => {
    return db.contain.create({
        foodId,
        ingredientId
    });
}

//Return compositions by their ids and the type (food or ingredient)
exports.getSpecificCompositions = async (id, type) => {
    let result;
    if (type=="food") {
        result = await db.contain.findAll({
            where: {
                foodId: id
            },
            include: [{
                model: db.ingredients,
                as : 'containIngredient',
                attributes: ['id', 'name']
            }]
        });
    }
    else if (type=="ingredient") {
        result = await db.contain.findAll({
            where: {
                IngredientId: id
            }
        });
    }
    else {
        return false;
    }

    if (result.length > 0) {
        return result;
    }
    else {
        return false;
    }
}

//Delete all compositions of food
exports.deleteCompositionsOfFood = (foodId) => {
    return db.contain.destroy({
        where: {
            foodId
        }
    });
}

//Delete an ingredient of food
exports.deleteIngredientOfFood = (foodId, ingredientId) => {
    return db.contain.destroy({
        where: {
            foodId,
            ingredientId
        }
    });
}

//Update the composition
exports.replaceIngredientOfFood = async (foodId, ingredientId, newIngredientId) => {
    return await db.contain.update({
        ingredientId: newIngredientId
    }, 
    { where: {
            foodId,
            ingredientId
        }
    });
}

//Return the contain by its foodId and ingredientId
exports.getContainByIds = async (foodId, ingredientId) => {
    return await db.contain.findOne({
        where: {
            foodId,
            ingredientId
        }
    });
}