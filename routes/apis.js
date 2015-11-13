var express = require('express');
var router = express.Router();

router.all('/*', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

router.use('/slideshare', require('./../server/controllers/apis/slideshare'))

module.exports = router;
