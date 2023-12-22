//------------- Import -------------
const { getIngredients } = require('../services/ingredientsService.js');

//------------- Methods -------------
//Get the list of ingredients 
exports.getIngredients = async (req, res) => {
    const ingredients = await getIngredients();
    res.json({success: true, data: ingredients});
}


//Add a ingredients
exports.addIngredients = async (req, res) => {
    const ingredient = await this.addIngredients(req.body.name);
    if (ingredient) {
        res.status(201).json({success: true, ingredient: ingredient});
    } 
    else {
        res.status(404).json({success: false, message: "Error when creating this ingredient, verify your args"});
    }
 }

//Get a ingredient
exports.getIngredientsById = async (req, res, id, role) => {
    const ingredient = await getIngredientsById(req.params.id);
    if (ingredient==null) {
        res.status(404).json({success: false, message: "This ingredient doesn't exist"});
    }
    else if ((ingredient.id != id)&&(role!="admin")) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        res.status(200).json({success: true, data: ingredient});
     }
}

//Delete a ingredient
exports.deleteIngredientsById = async (req, res, id, role) => {
    const ingredient = await getIngredientsById(req.params.id);
    if (ingredient==null) {
        res.status(404).json({success: false, message: "This ingredient doesn't exist"});
    }
    else if ((ingredient.id != id)&&(role!="admin")) {
        res.status(401).json({ success: false, message: 'Access forbidden' });
    }
    else {
        deleteIngredientById(req.params.id);
        res.status(204).send();
     }
}

//Update a ingredient
exports.updateIngredientsById = async (req, res, id, role) => {
    const ingredient = await getIngredientsById(req.params.id);
    if (ingredient==null) {
        res.status(404).json({success: false, message: "This ingredient doesn't exist"});
    }
    else if (role=="admin") {
        const ingredient = await updateIngredientsById(req.params.id, req.body.name);
        if (ingredient) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this ingredient, verify your args"});
        }
    }
    else if (role=="ingredient"&&ingredient.id==id) {
        const ingredient = await updateIngredientsById(req.params.id, req.body.name);
        if (ingredient) {
            res.status(204).send(); 
        }
        else {
            res.status(400).json({success: false, message: "Error when updating this ingredient, verify your args"});
        }
    }
    else {
        res.status(401).json({ success: false, message: 'Access forbidden' });
     }
}