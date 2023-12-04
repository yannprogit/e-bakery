//------------- Import -------------
const router = require('express').Router();
const employeesController = require('../controllers/employeesController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', authMiddleware(['admin']), (req, res) => {
    employeesController.getEmployees(req, res);
});

router.get('/deliverymen', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.getEmployeesByRole(req, res, 2);
});

router.get('/managers', authMiddleware(['admin']), (req, res) => {
    employeesController.getEmployeesByRole(req, res, 5);
});

router.get('/cooks', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.getEmployeesByRole(req, res, 3);
});

router.get('/cashiers', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.getEmployeesByRole(req, res, 4);
});

router.get('/:id', authMiddleware(['admin', 'manager', 'deliveryman', 'cashier', 'cook']), (req, res) => {
    employeesController.getEmployeeById(req, res, req.user.id, req.user.role);
});

router.post('/', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.addEmployee(req, res);
});

router.delete('/:id', authMiddleware(['admin', 'manager', 'deliveryman', 'cashier', 'cook']), (req, res) => {
    employeesController.getEmployeeById(req, res, req.user.id, req.user.role);
});

module.exports = router;