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

router.get('/bakers', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.getEmployeesByRole(req, res, 3);
});

router.get('/cashiers', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.getEmployeesByRole(req, res, 4);
});

router.get('/:id', authMiddleware(['admin', 'manager', 'deliveryman', 'cashier', 'baker']), (req, res) => {
    employeesController.getEmployeeById(req, res, req.user.id, req.user.role);
});

router.post('/', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.addEmployee(req, res, req.user.role);
});

router.delete('/:id', authMiddleware(['admin', 'manager']), (req, res) => {
    employeesController.deleteEmployeeById(req, res, req.user.id, req.user.role);
});

router.put('/:id', authMiddleware(['admin', 'manager', 'deliveryman', 'cashier', 'baker']), (req, res) => {
    employeesController.updateEmployeeById(req, res, req.user.id, req.user.role);
});

module.exports = router;