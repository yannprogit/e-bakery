//------------- Import -------------
const db = require('../models/index.js');

//------------- Methods -------------

//Return the list of purchases
exports.getPurchases = async () => {
    return await db.buy.findAll();
}

//Add a purchase (in cart)
exports.addBuy = (customerId, foodId) => {
    return db.buy.create({
        customerId,
        foodId,
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

//Update the status for a buy by its id
exports.updateStatus = async (id) => {
    const deliverymen = await db.employees.findAll({
        where: {
            role: 2
        }
    });

    const deliverymenIds = deliverymen.map(deliveryman => deliveryman.id);
    const randomIndex = Math.floor(Math.random() * deliverymenIds.length);

    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    return await db.buy.update({
        status: "paid",
        deliverymanId: deliverymenIds[randomIndex],
        dueDate
    }, 
    { where: {
            id
        }
    });
}

//Update the validation for a buy by its id
exports.updateValidation = async (id) => {
    const buy = await db.buy.findOne({
        where: {
            id
        }
    });

    if (buy.validation==false) {
        return await db.buy.update({
            validation: true 
        }, 
        { where: {
                id
            }
        });
    }
    else {
        return false;
    }

}