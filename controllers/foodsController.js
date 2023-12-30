//------------- Import -------------
const { getFoods, addFood, getFoodById, deleteFoodById, updateFoodByAdmin, updatePrice, updateFoodByBaker } = require('../services/foodsService.js');
const Ajv = require('ajv');
const ajv = new Ajv();

//------------- Methods -------------
//Get the list of foods
exports.getFoods = async (req, res) => {
    const foods = await getFoods();
    res.status(200).json({success: true, data: foods});
}

//Add a food
exports.addFood = async (req, res) => {
    const food = await addFood(req.body.name, req.body.price, req.body.description, req.body.stock);
    if (food) {
        res.status(201).json({success: true, food: food});
    } 
    else {
        res.status(400).json({success: false, message: "The stock must be over 0"});
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
        const deletedFood = await deleteFoodById(req.params.id);
        if (deletedFood) {
            res.status(204).send();
        }
        else {
            res.status(422).json({success: false, message: "This food is still being delivered"});
        }
     }
}

//Update a food
exports.updateFoodById = async (req, res, role) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else if (role=="admin") {
        const schema = {
            type: 'object',
            properties: {
              name: { type: 'string' },
              price: { type: 'number' , minimum: 0},
              description: { type: 'string' },
              addStock: { type: 'integer' },
            },
            required: ['name', 'price', 'description'],
          };
        const validateBody = ajv.validate(schema, req.body);
        if (!validateBody) {
            res.status(400).json({success: false, message: ajv.errors});
        }
        else {
            const food = await updateFoodByAdmin(req.params.id, req.body.name, req.body.price, req.body.description, req.body.addStock !== undefined ? req.body.addStock : 0);
            if (food=="negStock") {
                res.status(400).json({success: false, message: "The addition of stock must be over 0"});
            }
            else if (food=="noCompositions") {
                res.status(422).json({success: false, message: "You must add compositions to this food to be able to add stocks"});
            }
            else if (!food) {
                res.status(422).json({success: false, message: "There aren't enough ingredients left to increase the stock of this food"});
            }
            else {
                res.status(204).send(); 
            }
        }
    }
    else if (role=="baker") {
        const schema = {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              addStock: { type: 'integer' },
            },
            required: ['name', 'description'],
          };
        const validateBody = ajv.validate(schema, req.body);
        if (!validateBody) {
            res.status(400).json({success: false, message: ajv.errors});
        }
        else {
            const food = await updateFoodByBaker(req.params.id, req.body.name, req.body.description, req.body.addStock !== undefined ? req.body.addStock : 0);
            if (food=="negStock") {
                res.status(400).json({success: false, message: "The addition of stock must be over 0"});
            }
            else if (food=="noCompositions") {
                res.status(422).json({success: false, message: "You must add compositions to this food to be able to add stocks"});
            }
            else if (!food) {
                res.status(422).json({success: false, message: "There aren't enough ingredients left to increase the stock of this food"});
            }
            else {
                res.status(204).send(); 
            }
        }
    }
    else {
        const schema = {
            type: 'object',
            properties: {
              price: { type: 'number' , minimum: 0},
            },
            required: ['price'],
          };
        const validateBody = ajv.validate(schema, req.body);
        if (!validateBody) {
            res.status(400).json({success: false, message: ajv.errors});
        }
        else {
            await updatePrice(req.params.id, req.body.price);
            res.status(204).send(); 
        }
    }
}