//------------- Import -------------
const router = require('express').Router();
const foodController = require('../controllers/foodsController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', foodController.getFoods);

router.get('/:id', foodController.getFoodById);

router.post('/', authMiddleware(['admin','baker']), (req, res) => {
    foodController.addFood(req, res);
});

router.delete('/:id', authMiddleware(['admin','baker']), (req, res) => {
    foodController.deleteFoodById(req, res);
});

router.put('/:id', authMiddleware(['admin','baker','cashier']), (req, res) => {
    foodController.updateFoodById(req, res, req.user.role);
});


module.exports = router;