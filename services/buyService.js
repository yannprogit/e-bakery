//------------- Import -------------
const db = require('../models/index.js');
const { Op } = require('sequelize');

//------------- Methods -------------

//Return the list of purchases
exports.getPurchases = async () => {
    return await db.buy.findAll();
}

exports.getCart = async (customerId) => {
    return await db.buy.findAll({
        where: {
            customerId,
            status: 'cart'
        }
    });
}

exports.getPaidPurchases = async (customerId) => {
    return await db.buy.findAll({
        where: {
            customerId,
            status: 'paid'
        }
    });
}

//Add a purchase (in cart)
exports.addBuy = (customerId, foodId, qty) => {
    return db.buy.create({
        customerId,
        foodId,
        qty,
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
exports.updateStatus = async (id, hour) => {
    const buy = await db.buy.findOne({
        where: {
            id
        }
    });
    
    //Assign date of delivery
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 4);
    const [hours, minutes] = hour.split(':');
    dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    //Assign deliveryman
    const deliverymen = await db.employees.findAll({
        where: {
            role: 2,
            [Op.or]: [
                { endContract: { [Op.gt]: dueDate } },
                { endContract: null }
            ]
        }
    });

    const deliverymenIds = deliverymen.map(deliveryman => deliveryman.id);

    if (deliverymenIds.length == 0) {
        return false;
    } else {
        let selectedDeliverymanId;

        //Check if the deliveryman has already made a delivery to the same customer on the same date
        const existingDelivery = await db.buy.findOne({
            where: {
                dueDate,
                customerId: buy.customerId
            }
        });

        if (existingDelivery) { //If this is the case, we will assign it to this deliveryman, as he will be able to deliver them all to the customer at once.
            selectedDeliverymanId = existingDelivery.deliverymanId;
        } else { //Else, we will choose randomly an available deliveryman
            const purchases = await db.buy.findAll({
                where: {
                    dueDate
                }
            });
            const busyDeliverymenIds = purchases.map(buy => buy.deliverymanId);
            const availableDeliverymenIds = deliverymenIds.filter(deliverymanId => !busyDeliverymenIds.includes(deliverymanId));

            if (availableDeliverymenIds.length == 0) {
                return "noDeliverymen";
            }

            const randomIndex = Math.floor(Math.random() * availableDeliverymenIds.length);
            selectedDeliverymanId = availableDeliverymenIds[randomIndex];
        }

        //Check the food stock
        const food = await db.foods.findOne({
            where: {
                id: buy.foodId
            }
        });

        const newStock = food.stock - buy.qty;

        if (newStock < 0) {
            return "noFoods";
        }

        //Update the food stock
        await db.foods.update({
            stock: newStock
        }, 
        { where: {
                id: buy.foodId
            }
        });

        //Update the buy
        return await db.buy.update({
            status: "paid",
            deliverymanId: selectedDeliverymanId,
            dueDate
        }, 
        { where: {
                id
            }
        });
    }
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