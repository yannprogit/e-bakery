const express = require('express'),
      router = express.Router(),
      loginController = require('../controllers/loginController.js');

router.post('/', loginController.login);

module.exports = router;