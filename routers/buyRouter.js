//------------- Import -------------
const router = require('express').Router();
const buyController = require('../controllers/buyController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', buyController.getPurchases);
router.post('/', authMiddleware, (req, res) => {
    if (req.user && req.user.role == 'customer') {
        buyController.addBuy(req, res);
    } 
});
router.get('/:id', authMiddleware, (req, res) => {
    if (req.user && (req.user.role == 'customer' || req.user.role == 'deliveryman')) {
        buyController.getBuyById(req, res, req.user.id, req.user.role);
    } 
});
router.delete('/:id', authMiddleware, (req, res) => {
    if (req.user && req.user.role == 'customer') {
        buyController.deleteBuyById(req, res, req.user.id);
    } 
});
router.put('/:id', authMiddleware, (req, res) => {
    if (req.user && req.user.role == 'deliveryman') {
        buyController.updateDeliveryDate(req, res, req.user.id);
    } 
});

module.exports = router;