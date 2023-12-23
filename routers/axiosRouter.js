const router = require('express').Router();
const axiosController = require('../controllers/axiosController');
const { authMiddleware } = require('../controllers/loginController');

router.post('/', authMiddleware(['admin']), (req, res) => {
    axiosController.populateDatabase(req, res);
});

module.exports = router;