//------------- Import -------------
const router = require('express').Router();
const employeesController = require('../controllers/employeesController');

//------------- Routes -------------
router.get('/', employeesController.getEmployees);

module.exports = router;