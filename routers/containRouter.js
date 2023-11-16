//------------- Import -------------
const router = require('express').Router();
const containController = require('../controllers/containController');

//------------- Routes -------------
router.get('/', containController.getCompositions);

module.exports = router;