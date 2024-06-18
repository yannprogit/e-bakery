//------------- Import -------------
const { getFoods, getThreeFoods, addFood, getFoodById, deleteFoodById, updateFoodByAdmin, updatePrice, updateFoodByBaker, updateFoodImage } = require('../services/foodsService.js');
//const Ajv = require('ajv');
//const ajv = new Ajv();
const path = require('path');
const fs = require('fs');

//------------- Methods -------------
//Get the list of foods
exports.getFoods = async (req, res) => {
    const foods = await getFoods();
    res.status(200).json({success: true, data: foods});
}

//Get the 3 random foods
exports.getThreeFoods = async (req, res) => {
    const foods = await getThreeFoods();
    res.status(200).json({success: true, data: foods});
}

//Add a food
exports.addFood = async (req, res) => {
    if (req.file) {
        const price = parseFloat(req.body.price);
        const stock = parseInt(req.body.stock);

        let food = await addFood(req.body.name, price, req.body.description, stock);
        if (food) {
            const id = food.id;
            await updateFoodImage(id);
            const folder = path.join(__dirname, '..', 'images');
            const imageFilePath = path.join(folder, id.toString()+".png");
            fs.renameSync(req.file.path, imageFilePath);
            food = await getFoodById(id);
            res.status(201).json({success: true, food: food});
        } 
        else {
            res.status(400).json({success: false, message: "The stock must be over 0"});
        }
    } else {
        res.status(400).json({success: false, message: "You must put an image"});
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
            const imageFilePath = path.join(__dirname, '..', 'images', req.params.id + ".png");
            fs.access(imageFilePath, fs.constants.F_OK, (err) => {
                if (err) {
                    res.status(204).send();
                } else {
                    fs.unlink(imageFilePath, (err) => {
                        if (err) {
                            res.status(500).json({ success: false, message: "Error by suppressing image" });
                        } else {
                            res.status(204).send();
                        }
                    });
                }
            });
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
        let price, addStock;
        if (((req.body.addStock!==undefined)&&(!isNaN(req.body.addStock)))&&(!isNaN(req.body.price))) {
            price = parseFloat(req.body.price);
            addStock = parseInt(req.body.addStock);
        } else {
            res.status(400).json({success: false, message: "Your price/add stock are not valid numbers"});
        }
        /*const schema = {
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
        else {*/
            console.log("name : ", req.body.name, " ", "price : ",req.body.price);
            if (req.file) {
                await updateFoodImage(req.params.id);
                const imageFilePath = path.join(__dirname, '..', 'images', req.params.id + ".png");
                fs.access(imageFilePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        fs.renameSync(req.file.path, imageFilePath);
                        res.status(204).send();
                    } else {
                        fs.unlink(imageFilePath, (err) => {
                            if (err) {
                                res.status(500).json({ success: false, message: "Error by updating image" });
                            } else {
                                fs.renameSync(req.file.path, imageFilePath);
                                res.status(204).send();
                            }
                        });
                    }
                });
            }

            const food = await updateFoodByAdmin(req.params.id, req.body.name, price, req.body.description, addStock !== undefined ? req.body.addStock : 0);
            if (food=="negStock") {
                res.status(400).json({success: false, message: "The addition of stock must be over 0"});
            }
            else if (food=="noCompositions") {
                res.status(422).json({success: false, message: "You must add compositions to this food to be able to add stocks"});
            }
            else {
                res.status(422).json({success: false, message: "There aren't enough ingredients left to increase the stock of this food"});
            }
        //}
    }
    else if (role=="baker") {
        let addStock;
        if (((req.body.addStock!==undefined)&&(!isNaN(req.body.addStock)))) {
            addStock = parseInt(req.body.addStock);
        } else {
            res.status(400).json({success: false, message: "Your add stock are not valid numbers"});
        }
        /*const schema = {
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
        else {*/
            const food = await updateFoodByBaker(req.params.id, req.body.name, req.body.description, addStock !== undefined ? req.body.addStock : 0);
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
                if (req.file) {
                    const imageFilePath = path.join(__dirname, '..', 'images', req.params.id + ".png");
                    fs.access(imageFilePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            fs.renameSync(req.file.path, imageFilePath);
                            res.status(204).send();
                        } else {
                            fs.unlink(imageFilePath, (err) => {
                                if (err) {
                                    res.status(500).json({ success: false, message: "Error by updating image" });
                                } else {
                                    fs.renameSync(req.file.path, imageFilePath);
                                    res.status(204).send();
                                }
                            });
                        }
                    });
                } else {
                    res.status(500).json({ success: false, message: "There is no image" });
                }
            }
        //}
    }
    else {
        /*const schema = {
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
        else {*/
            await updatePrice(req.params.id, req.body.price);
            res.status(204).send(); 
        //}
    }
}

//Get food's image 
exports.getFoodImage = async (req, res) => {
    try {
        const foodId = req.params.id; 
        const imagePath = path.join(__dirname, '../images/', `${foodId}.png`);

        res.sendFile(imagePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error during image recuperation" });
    }
};