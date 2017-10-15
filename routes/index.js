var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var color = req.query.color; 
  res.render('index', { title: 'The color is ' + color });
  
});

module.exports = router;
