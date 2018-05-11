var express = require('express');
var patronsRouter = express.Router();

/* GET home page. */
patronsRouter.get('/', function(req, res, next) {
  res.render('home', { title: 'patrons' });
});

module.exports = patronsRouter;
