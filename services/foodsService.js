//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of foods
exports.getFoods = async () => {
    return await db.foods.findAll();
}

//Add a food
exports.addFood = (name, price) => {
    return db.foods.create({
        name,
        price
    });
}

//Return the food by its id
exports.getFoodById = async (id) => {
    return await db.foods.findOne({
        where: {
            id
        }
    });
}
//Delete the food by its id
exports.deleteFoodById = (id) => {
    return db.foods.destroy({
        where: {
            id
        }
    });
}

//Update the food by its id
exports.updateFoodById = async (id, name, price) => {
    return await db.foods.update({
        name,
        price
    }, 
    { where: {
            id
        }
    });
}