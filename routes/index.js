var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.njk', { title: 'DALE BO' });
});

module.exports = router;
