//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of foods
exports.getFoods = async () => {
    return await db.foods.findAll();
}

//Add a food
exports.addFood = (name, price, description, stock) => {
    return db.foods.create({
        name,
        price,
        description,
        stock
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

//Update the food by admin
exports.updateFoodByAdmin = async (id, name, price, description, stock) => {
    return await db.foods.update({
        name,
        price,
        description,
        stock
    }, 
    { where: {
            id
        }
    });
}

//Update the food by baker
exports.updateFoodByBaker = async (id, name, description, stock) => {
    return await db.foods.update({
        name,
        description,
        stock
    }, 
    { where: {
            id
        }
    });
}

//Update the price of food
exports.updatePrice = async (id, price) => {
    return await db.foods.update({
        price
    }, 
    { where: {
            id
        }
    });
}