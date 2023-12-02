//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of purchases
exports.getPurchases = async () => {
    return await db.buy.findAll();
}

//Add a purchase
exports.addBuy = (dueDate, customerId, foodId, deliverymanId) => {
    return db.buy.create({
        dueDate: dueDate,
        customerId: customerId,
        foodId: foodId,
        deliverymanId: deliverymanId
    });
}

//Return the buy by its id
exports.getBuyById = async (id) => {
    return await db.buy.findOne({
        where: {
            id
        }
    });
}

//Delete the buy by its id
exports.deleteBuyById = (id) => {
    return db.buy.destroy({
        where: {
            id
        }
    });
}

//Update the deliveryDate for a buy by its id
exports.updateDeliveryDate = async (id) => {
    const today = new Date();

    return await db.buy.update({
        deliveryDate: today 
    }, 
    { where: {
            id
        }
    });
}