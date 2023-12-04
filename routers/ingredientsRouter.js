//------------- Import -------------
const router = require('express').Router();
const ingredientController = require('../controllers/ingredientsController');
const { authMiddleware } = require('../controllers/loginController');
//------------- Routes -------------
router.get('/', ingredientController.getIngredients);

router.get('/:id', ingredientController.getIngredientsById);

router.post('/', authMiddleware(['admin','cook']), (req, res) => {
    IngredientsController.addIngredients(req, res);
});

router.delete('/:id', authMiddleware(['admin','cook']), (req, res) => {
    IngredientsController.deleteIngredientsById(req, res, req.user.id);
});

router.put('/:id', authMiddleware(['admin','cook']), (req, res) => {
    IngredientsController.updateIngredientsById(req, res, req.user.id);
});


module.exports = router;