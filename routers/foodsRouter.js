//------------- Import -------------
const router = require('express').Router();
const foodController = require('../controllers/foodsController');
const { authMiddleware } = require('../controllers/loginController');
const multer = require('multer');
const upload = multer({ dest: '../images/' });

//------------- Routes -------------
router.get('/', foodController.getFoods);

router.get('/:id', foodController.getFoodById);

router.post('/', authMiddleware(['admin','baker']), upload.single('image'), (req, res) => {
    foodController.addFood(req, res);
});

router.delete('/:id', authMiddleware(['admin','baker']), (req, res) => {
    foodController.deleteFoodById(req, res);
});

router.put('/:id', authMiddleware(['admin','baker','cashier']), upload.single('image'), (req, res) => {
    foodController.updateFoodById(req, res);
});

router.get('/:id/image', foodController.getFoodImage);

module.exports = router;