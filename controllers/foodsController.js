//------------- Import -------------
const { getFoods } = require('../services/foodsService.js');



//------------- Methods -------------
//Get the list of foods
exports.getFoods = async (req, res) => {
    const foods = await getFoods();
    res.json({success: true, data: foods});
}

//Add a food
exports.addFood = async (req, res) => {
    const food = await this.addFood(req.body.name, req.body.price);
    if (food) {
        res.status(201).json({success: true, food: food});
    } 
    else {
        res.status(404).json({success: false, message: "Error when creating this food, verify your args"});
    }
 }

//Get a food
exports.getFoodById = async (req, res, id, role) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else if ((food.id != id)&&(role!="admin")) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        res.status(200).json({success: true, data: food});
     }
}

//Delete a food
exports.deleteFoodById = async (req, res, id, role) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else if ((food.id != id)&&(role!="admin")) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        deleteFoodById(req.params.id);
        res.status(204).send();
     }
}

//Update a food
exports.updateFoodById = async (req, res, id, role) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else if (role=="admin") {
        const food = await updateFoodById(req.params.id, req.body.name, req.body.price);
        if (food) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this food, verify your args"});
        }
    }
    else if (role=="food"&&food.id==id) {
        const food = await updateFoodById(req.params.id, req.body.name, req.body.price);
        if (food) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this food, verify your args"});
        }
    }
    else {
        res.status(401).json({ success: false, message: 'Access forbidden' });
     }
}