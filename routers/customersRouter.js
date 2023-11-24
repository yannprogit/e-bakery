//------------- Import -------------
const router = require('express').Router();
const customerController = require('../controllers/customersController');

//------------- Routes -------------
router.get('/', customerController.getCustomers);

module.exports = router;