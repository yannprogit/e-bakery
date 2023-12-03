//------------- Import -------------
const router = require('express').Router();
const buyController = require('../controllers/buyController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', buyController.getPurchases);

router.post('/', authMiddleware(['customer']), (req, res) => {
    buyController.addBuy(req, res);
});

router.get('/:id', authMiddleware(['customer', 'deliveryman']), (req, res) => {
    buyController.getBuyById(req, res, req.user.id, req.user.role);
});

router.delete('/:id', authMiddleware(['customer']), (req, res) => {
    buyController.deleteBuyById(req, res, req.user.id);
});

router.put('/:id', authMiddleware(['deliveryman']), (req, res) => {
    buyController.updateDeliveryDate(req, res, req.user.id);
});

module.exports = router;