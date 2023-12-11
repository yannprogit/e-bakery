//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of purchases
exports.getPurchases = async () => {
    return await db.buy.findAll();
}

//Add a purchase (logic with stock)
exports.addBuy = (customerId, foodId, deliverymanId) => {
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    return db.buy.create({
        dueDate,
        customerId,
        foodId,
        deliverymanId
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