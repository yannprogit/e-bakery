//------------- Import -------------
const router = require('express').Router();
const ingredientController = require('../controllers/ingredientsController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', authMiddleware(['admin','baker']), (req, res) => {
    ingredientController.getIngredients(req, res);
});

router.get('/:id', authMiddleware(['admin','baker']), (req, res) => {
    ingredientController.getIngredientById(req, res);
});

router.post('/', authMiddleware(['admin','baker']), (req, res) => {
    ingredientController.addIngredient(req, res);
});

router.delete('/:id', authMiddleware(['admin','baker']), (req, res) => {
    ingredientController.deleteIngredientById(req, res);
});

router.put('/:id', authMiddleware(['admin','baker']), (req, res) => {
    ingredientController.updateIngredientById(req, res);
});


module.exports = router;