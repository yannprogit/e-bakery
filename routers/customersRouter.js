//------------- Import -------------
const router = require('express').Router();
const customerController = require('../controllers/customersController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', authMiddleware(['admin', 'deliveryman']), (req, res) => {
    customerController.getCustomers(req, res);
});

router.post('/', customerController.addCustomer);

router.get('/:id', authMiddleware(['admin', 'customer']), (req, res) => {
    customerController.getCustomerById(req, res, req.user.id, req.user.role);
});

router.delete('/:id', authMiddleware(['admin', 'customer']), (req, res) => {
    customerController.deleteCustomerById(req, res, req.user.id, req.user.role);
});

router.put('/:id', authMiddleware(['admin', 'customer']), (req, res) => {
    customerController.updateCustomerById(req, res, req.user.id, req.user.role);
});

module.exports = router;
