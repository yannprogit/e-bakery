//------------- Import -------------
const router = require('express').Router();
const containController = require('../controllers/containController');
const { authMiddleware } = require('../controllers/loginController');

//------------- Routes -------------
router.get('/', containController.getCompositions);

router.post('/', authMiddleware(['admin','baker']), (req, res) => {
    containController.addContain(req, res);
});

router.get('/:type/:id', containController.getSpecificCompositions);

router.delete('/', authMiddleware(['admin','baker']), (req, res) => {
    containController.deleteContain(req, res);
});

router.put('/food/:id', authMiddleware(['admin','baker']), (req, res) => {
    containController.replaceIngredientOfFood(req, res);
});

module.exports = router;