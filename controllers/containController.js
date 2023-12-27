//------------- Import -------------
const { getCompositions, addContain, getSpecificCompositions, replaceIngredientOfFood, deleteIngredientOfFood, deleteCompositionsOfFood, getContainByIds } = require('../services/containService.js');
const { getFoodById } = require('../services/foodsService.js');

//------------- Methods -------------
//Get the list of compositions
exports.getCompositions = async (req, res) => {
    const contain = await getCompositions();
    res.status(200).json({success: true, data: contain});
}

//Add a contain
exports.addContain = async (req, res) => {
    const existContain = await getContainByIds(req.body.foodId, req.body.ingredientId);
    if (existContain) {
        res.status(422).json({success: false, message: "This contain already exist"});
    }
    else {
        await addContain(req.body.foodId, req.body.ingredientId);
        res.status(201).json({success: true, contain: contain});
    }
 }

//Delete compositions or an ingredient of a food
exports.deleteContain = async (req, res) => {
    const ingredientId = req.query.ingredientId;
    if (!ingredientId) {
        const compositions = await getSpecificCompositions(req.params.foodId, "food");
        if (!compositions) {
            res.status(404).json({success: false, message: "This food has no compositions"});
        }
        else {
            deleteCompositionsOfFood(req.params.foodId);
            res.status(204).send();
         }
    }
    else {
        const existContain = await getContainByIds(req.params.foodId, ingredientId);
        if (!existContain) {
            res.status(404).json({success: false, message: "This contain doesn't exist"});
        }
        else {
            deleteIngredientOfFood(req.params.foodId, ingredientId);
            res.status(204).send();
         }
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
    const food = await getFoodById(req.params.foodId);
    if (food==null) {
        res.status(404).json({success: false, message: "This food doesn't exist"});
    }
    else {
        const contain = await getContainByIds(req.params.foodId, req.body.ingredientId);
        const existContain = await getContainByIds(req.params.foodId, req.body.newIngredientId);

        if (contain==null) {
            res.status(404).json({success: false, message: "This contain doesn't exist"});
        }
        else if (existContain) {
            res.status(422).json({success: false, message: "This contain already exist"});
        }
        else {
            await replaceIngredientOfFood(req.params.foodId, req.body.ingredientId, req.body.newIngredientId);
            res.status(204).send(); 
        }
    }
}