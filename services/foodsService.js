//------------- Import -------------
const db = require('../models/index.js');
const { Op } = require('sequelize');

//------------- Methods -------------

//Return the list of foods
exports.getFoods = async () => {
    return await db.foods.findAll();
}

//Add a food
exports.addFood = (name, price, description, stock) => {
    if (stock<0) {
        return false;
    }
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
exports.deleteFoodById = async (id) => {
    const deliveryInProgress = await db.buy.findOne({
        where: {
            foodId: id,
            validation: false,
            status: "paid"
        }
    });

    if (!deliveryInProgress) {
        db.buy.destroy({
            where: {
                foodId: id,
                status: "cart"
            }
        });

        db.contain.destroy({
            where: {
                foodId: id
            }
        });

        await db.buy.update({
            foodId: null
        }, 
        { where: {
                foodId: id
            }
        });

        return db.foods.destroy({
            where: {
                id
            }
        });
    }
    else {
        return false;
    }
}

//Update the food by admin
exports.updateFoodByAdmin = async (id, name, price, description, addStock) => {
    if (addStock < 0){
        return "negStock";
    }

    const food = await db.foods.findOne({
        where: {
            id
        }
    });

    const compositions = await db.contain.findAll( { 
        where: {
                foodId: id
            }
        });

    if (compositions.length > 0) {
        const ingredientIds = compositions.map(composition => composition.ingredientId);
        const ingredients = await db.ingredients.findAll({
            where: {
              id: {
                [Op.in]: ingredientIds
              }
            }
          });

        const ingredientStocks = ingredients.map(ingredient => ingredient.stock - addStock);
        if (ingredientStocks.some(stock => stock < 0)) {
            return false;
        }
        else {
            for (let i = 0; i < ingredients.length; i++) {
                const ingredient = ingredients[i];
                const newStock = ingredient.stock - addStock;

                await db.ingredients.update(
                    { stock: newStock },
                    {
                      where: {
                        id: ingredient.id
                      }
                    }
                  );
            }
        }
    }
    else {
        return "noCompositions";
    }

    let addedStock = food.stock + addStock;
    return await db.foods.update({
        name,
        price,
        description,
        stock: addedStock
    }, 
    { where: {
            id
        }
    });
}

//Update the food by baker
exports.updateFoodByBaker = async (id, name, description, addStock) => {
    if (addStock < 0){
        return "negStock";
    }

    const food = await db.foods.findOne({
        where: {
            id
        }
    });

    const compositions = await db.contain.findAll( { 
        where: {
                foodId: id
            }
        });

    if (compositions.length > 0) {
        const ingredientIds = compositions.map(composition => composition.ingredientId);
        const ingredients = await db.ingredients.findAll({
            where: {
              id: {
                [Op.in]: ingredientIds
              }
            }
          });

        const ingredientStocks = ingredients.map(ingredient => ingredient.stock - addStock);
        if (ingredientStocks.some(stock => stock < 0)) {
            return "noIngredients";
        }
        else {
            for (let i = 0; i < ingredients.length; i++) {
                const ingredient = ingredients[i];
                const newStock = ingredient.stock - addStock;

                await db.ingredients.update(
                    { stock: newStock },
                    {
                      where: {
                        id: ingredient.id
                      }
                    }
                  );
            }
        }
    }

    let addedStock = food.stock + addStock;
    return await db.foods.update({
        name,
        description,
        stock: addedStock
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