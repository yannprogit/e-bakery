//------------- Import -------------
const { getFoods } = require('../services/foodsService.js');

//------------- Methods -------------
//Get the list of foods
exports.getFoods = async (req, res) => {
    const foods = await getFoods();
    res.json({success: true, data: foods});
}