//------------- Import -------------
const router = require('express').Router();
const ingredientController = require('../controllers/ingredientsController');

//------------- Routes -------------
router.get('/', ingredientController.getIngredients);

module.exports = router;