//------------- Import -------------
const router = require('express').Router();
const foodController = require('../controllers/foodsController');
const { authMiddleware } = require('../controllers/loginController');
//------------- Routes -------------
router.get('/', foodController.getFoods);

router.get('/:id', foodController.getFoodById);

router.post('/', authMiddleware(['admin','cook']), (req, res) => {
    foodsController.addFood(req, res);
});

router.delete('/:id', authMiddleware(['admin','cook']), (req, res) => {
    foodsController.deleteFoodById(req, res, req.user.id);
});

router.put('/:id', authMiddleware(['admin','cook']), (req, res) => {
    foodsController.updateFoodById(req, res, req.user.id);
});


module.exports = router;