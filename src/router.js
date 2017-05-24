var express = require('express');
var router = express.Router();
var controller = require('./controller');

router.post('/user?:email', controller.email)

module.exports = router;
