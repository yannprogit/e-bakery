//------------- Import -------------
const router = require('express').Router();
const buyController = require('../controllers/buyController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', authMiddleware(['admin', 'cashier']), (req, res) => {
    buyController.getPurchases(req, res);
});

router.post('/', authMiddleware(['customer']), (req, res) => {
    buyController.addBuy(req, res);
});

router.get('/cart/all', authMiddleware(['customer']), (req, res) => {
    buyController.getCart(req, res);
});

router.get('/paid/all', authMiddleware(['customer']), (req, res) => {
    buyController.getPaidPurchases(req, res);
});

router.get('/:id', authMiddleware(['customer', 'deliveryman', 'admin']), (req, res) => {
    buyController.getBuyById(req, res, req.user.id, req.user.role);
});

router.delete('/:id', authMiddleware(['customer', 'admin']), (req, res) => {
    buyController.deleteBuyById(req, res, req.user.id);
});

router.put('/:id', authMiddleware(['deliveryman','customer','admin']), (req, res) => {
    buyController.updateBuyById(req, res, req.user.id, req.user.role);
});

module.exports = router;