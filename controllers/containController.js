//------------- Import -------------
const { getCompositions, addContain, getSpecificCompositions, replaceIngredientOfFood, deleteContain, getContainByIds } = require('../services/containService.js');
const { getFoodById } = require('../services/foodsService.js');

//------------- Methods -------------
//Get the list of compositions
exports.getCompositions = async (req, res) => {
    const contain = await getCompositions();
    res.json({success: true, data: contain});
}

//Add a contain
exports.addContain = async (req, res) => {
    const existContain = await getContainByIds(req.body.foodId, req.body.ingredientId);
    if (existContain) {
        res.status(422).json({success: false, message: "This contain already exist"});
    }
    else {
        const contain = await addContain(req.body.foodId, req.body.ingredientId);
        if (contain) {
            res.status(201).json({success: true, contain: contain});
        } 
        else {
            res.status(404).json({success: false, message: "Error when creating this contain, verify your args"});
        }
    }
 }

//Delete a contain
exports.deleteContain = async (req, res) => {
    const contain = await getContainByIds(req.body.foodId, req.body.ingredientId);
    if (contain==null) {
        res.status(404).json({success: false, message: "This contain doesn't exist"});
    }
    else {
        deleteContain(req.body.foodId, req.body.ingredientId);
        res.status(204).send();
     }
}

//Get compositions according to their ids and type (food or ingredient)
exports.getSpecificCompositions = async (req, res) => {
    const contain = await getSpecificCompositions(req.params.id, req.params.type);
    if (!contain) {
        res.status(404).json({success: false, message: "These compositions are impossible to find"});
    }
    else {
        res.status(200).json({success: true, data: contain});
     }
}

exports.replaceIngredientOfFood = async (req, res) => {
    const food = await getFoodById(req.params.id);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else {
        const contain = await getContainByIds(req.params.id, req.body.ingredientId);
        const existContain = await getContainByIds(req.params.id, req.body.newIngredientId);

        if (contain==null) {
            res.status(404).json({success: false, message: "This contain doesn't exist"});
        }
        else if (existContain) {
            res.status(422).json({success: false, message: "This contain already exist"});
        }
        else {
            const containUpdated = await replaceIngredientOfFood(req.params.id, req.body.ingredientId, req.body.newIngredientId);
            if (containUpdated) {
                res.status(204).send(); 
            }
            else {
                res.status(400).json({success: false, message: "Error when updating this ingredient, verify your args"});
            }
        }
    }
}