var express = require('express');
var router = express.Router();

router.get('/example', require('./example'));
router.get('/status', require('./status'));

module.exports = router;
