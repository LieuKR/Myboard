var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {pageinfo: 'Home', greenalert: req.cookies.greenalert, yellowalert: req.cookies.yellowalert,
  loginid : req.session.loginid});
});

module.exports = router;