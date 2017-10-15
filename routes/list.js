var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var color = req.query.color; 
  var colors = ['red', 'green', 'blue'];
  var lists = ['AAA', 'BBB', 'CCC'];
  var tab = [['1','Mark','Otto', 'mdo'], ['2','Ivan','Otto', 'mdo'], ['3','Denis','Otto', 'mdo']];
  res.render('list', { 
    colors: colors,
    lists: lists,
    tab: tab   
  });
  
});

module.exports = router;
