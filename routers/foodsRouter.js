//------------- Import -------------
const router = require('express').Router();
const foodController = require('../controllers/foodsController');

//------------- Routes -------------
router.get('/', foodController.getFoods);

module.exports = router;