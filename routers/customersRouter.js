//------------- Import -------------
const router = require('express').Router();
const customerController = require('../controllers/customersController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', customerController.getCustomers);

module.exports = router;