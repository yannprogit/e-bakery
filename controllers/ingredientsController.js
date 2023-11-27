//------------- Import -------------
const { getIngredients } = require('../services/ingredientsService.js');

//------------- Methods -------------
//Get the list of contains
exports.getIngredients = async (req, res) => {
    const ingredients = await getIngredients();
    res.json({success: true, data: ingredients});
}