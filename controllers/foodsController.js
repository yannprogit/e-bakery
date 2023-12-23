//------------- Import -------------
const { getFoods, addFood, getFoodById, deleteFoodById, updateFoodByAdmin, updatePrice, updateFoodByBaker } = require('../services/foodsService.js');

//------------- Methods -------------
//Get the list of foods
exports.getFoods = async (req, res) => {
    const foods = await getFoods();
    res.json({success: true, data: foods});
}

//Add a food
exports.addFood = async (req, res) => {
    const food = await addFood(req.body.name, req.body.price, req.body.description, req.body.stock);
    if (food) {
        res.status(201).json({success: true, food: food});
    } 
    else {
        res.status(404).json({success: false, message: "Error when creating this food, verify your args"});
    }
 }

//Get a food
exports.getFoodById = async (req, res) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else {
        res.status(200).json({success: true, data: food});
     }
}

//Delete a food
exports.deleteFoodById = async (req, res) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else {
        deleteFoodById(req.params.id);
        res.status(204).send();
     }
}

//Update a food
exports.updateFoodById = async (req, res, role) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else if (role=="admin") {
        const food = await updateFoodByAdmin(req.params.id, req.body.name, req.body.price, req.body.description, req.body.stock);
        if (food) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this food, verify your args"});
        }
    }
    else if (role=="baker") {
        const food = await updateFoodByBaker(req.params.id, req.body.name, req.body.description, req.body.stock);
        if (food) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this food, verify your args"});
        }
    }
    else {
        const food = await updatePrice(req.params.id, req.body.price);
        if (food) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this food, verify your args"});
        }
     }
}