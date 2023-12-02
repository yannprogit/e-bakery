//------------- Import -------------
const router = require('express').Router();
const employeesController = require('../controllers/employeesController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', authMiddleware, (req, res) => {
    if (req.user && req.user.role == 'admin') {
        employeesController.getEmployees(req, res);
    } 
});
router.get('/deliverymen', authMiddleware, (req, res) => {
    if (req.user && (req.user.role == 'admin' || req.user.role == 'manager')) {
        employeesController.getEmployeesByRole(req, res, 2);
    } 
});
router.get('/managers', authMiddleware, (req, res) => {
    if (req.user && req.user.role == 'admin') {
        employeesController.getEmployeesByRole(req, res, 5);
    } 
});
router.get('/cooks', authMiddleware, (req, res) => {
    if (req.user && (req.user.role == 'admin' || req.user.role == 'manager')) {
        employeesController.getEmployeesByRole(req, res, 3);
    } 
});
router.get('/cashiers', authMiddleware, (req, res) => {
    if (req.user && (req.user.role == 'admin' || req.user.role == 'manager')) {
        employeesController.getEmployeesByRole(req, res, 4);
    } 
});

module.exports = router;