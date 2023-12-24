//------------- Import -------------
const { getIngredients, addIngredient, getIngredientById, deleteIngredientById, updateIngredientById } = require('../services/ingredientsService.js');

//------------- Methods -------------
//Get the list of ingredients 
exports.getIngredients = async (req, res) => {
    const ingredients = await getIngredients();
    res.json({success: true, data: ingredients});
}


//Add an ingredient
exports.addIngredient = async (req, res) => {
    const ingredient = await addIngredient(req.body.name, req.body.stock);
    if (ingredient) {
        res.status(201).json({success: true, ingredient: ingredient});
    } 
    else {
        res.status(400).json({success: false, message: "The stock must be over 0"});
    }
 }

//Get an ingredient
exports.getIngredientById = async (req, res) => {
    const ingredient = await getIngredientById(req.params.id);
    if (ingredient==null) {
        res.status(404).json({success: false, message: "This ingredient doesn't exist"});
    }
    else {
        res.status(200).json({success: true, data: ingredient});
     }
}

//Delete an ingredient
exports.deleteIngredientById = async (req, res) => {
    const ingredient = await getIngredientById(req.params.id);
    if (ingredient==null) {
        res.status(404).json({success: false, message: "This ingredient doesn't exist"});
    }
    else {
        deleteIngredientById(req.params.id);
        res.status(204).send();
     }
}

//Update an ingredient
exports.updateIngredientById = async (req, res) => {
    const ingredient = await getIngredientById(req.params.id);
    if (ingredient==null) {
        res.status(404).json({success: false, message: "This ingredient doesn't exist"});
    }
    else {
        const ingredientUpdated = await updateIngredientById(req.params.id, req.body.name, req.body.addStock);
        if (!ingredientUpdated) {
            res.status(400).json({success: false, message: "The addition of stock must be over 0"});
        }
        else {
            res.status(204).send(); 
        }
    }
}