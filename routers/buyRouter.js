//------------- Import -------------
const router = require('express').Router();
const buyController = require('../controllers/buyController');

//------------- Routes -------------
router.get('/', buyController.getPurchases);

module.exports = router;