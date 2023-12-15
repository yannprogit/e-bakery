//------------- Import -------------
const { getPurchases, addBuy, getBuyById, deleteBuyById, updateDeliveryDate, updateStatus, updateValidation } = require('../services/buyService.js');
const { getFoodById } = require('../services/foodsService.js');

//------------- Methods -------------
//Get the list of purchases
exports.getPurchases = async (req, res) => {
    const buy = await getPurchases();
    res.json({success: true, data: buy});
}

//Add a buy
exports.addBuy = async (req, res) => {
    const food = await getFoodById(req.body.foodId);
    if (food!=null) {
        const buy = await addBuy(req.user.id, req.body.foodId);
        res.status(201).json({success: true, buy: buy});
    } else {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
 }

//Get a buy
exports.getBuyById = async (req, res, id, role) => {
    const buy = await getBuyById(req.params.id);
    if (buy==null) {
        res.status(404).json({success: false, message: "This buy doesn't exist"});
    }
    else if ((role=="customer" && buy.customerId != id)||(role=="deliveryman" && buy.deliverymanId != id)) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        res.json({success: true, data: buy});
     }
}

//Delete a buy
exports.deleteBuyById = async (req, res, customerId) => {
    const buy = await getBuyById(req.params.id);
    if (buy==null) {
        res.status(404).json({success: false, message: "This buy doesn't exist"});
    }
    else if (buy.status!="cart") {
        res.status(422).json({success: false, message: "This buy cannot be delete because it has been paid" });
    }
    else if (buy.customerId != customerId) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        deleteBuyById(req.params.id);
        res.status(204).send();
     }
}

//Update the deliveryDate of buy
exports.updateBuyById = async (req, res, id, role) => {
    const buy = await getBuyById(req.params.id);
    if (buy==null) {
        res.status(404).json({success: false, message: "This buy doesn't exist"});
    }
    else if ((role=="customer" && buy.customerId != id)||(role=="deliveryman" && buy.deliverymanId != id)) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        if (role=="deliveryman") {
            if (buy.deliveryDate != null) {
                res.status(422).json({success: false, message: "The delivery of this buy is already finished" });
            }
            else {
                await updateDeliveryDate(req.params.id);
                res.status(204).send(); 
            }
        }
        else {
            if (buy.status == "cart") {
                await updateStatus(req.params.id);
                res.status(204).send(); 
            }
            else if (buy.deliveryDate==null) {
                res.status(422).json({success: false, message: "The delivery of this buy is still in progress" });
            }
            else {
                const validation = await updateValidation(req.params.id);
                if (!validation) {
                    res.status(422).json({success: false, message: "You have already confirmed delivery" });
                }
                else {
                    res.status(204).send();   
                }  
            }
        }
    }
}