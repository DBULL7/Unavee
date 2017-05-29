var express = require('express');
var router = express.Router();
var controller = require('./controller');

router.post('/user?:email', controller.email)
router.post('/tweets', controller.tweets)
router.post('/watson', controller.watson)
router.post('/sendgrid', controller.sendgrid)
router.post('/emailAnalysis', controller.emailAnalysis)
module.exports = router;
