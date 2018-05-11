var express = require('express');
var loansRouter = express.Router();

/* GET home page. */
loansRouter.get('/', function(req, res, next) {
  res.render('home', { title: 'loans' });
});

module.exports = loansRouter;
