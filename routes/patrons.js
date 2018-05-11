var express = require('express');
var patronsRouter = express.Router();

/* REDIRECT to all patrons. */
patronsRouter.get('/', function(req, res, next) {
  res.redirect('/patrons/all');
});

/* GET all patrons. */
patronsRouter.get('/all', function(req, res, next) {
  var view = require.resolve('../views/patrons/all.pug');
  res.render(view, { title: 'All Patrons' });
});

/* GET form to create a new patron. */
patronsRouter.get('/new', function(req, res, next) {
  var view = require.resolve('../views/patrons/details.pug');
  res.render(view, { title: 'New Patron' });
});

/* GET patron details. */
patronsRouter.get('/details', function(req, res, next) {
  var view = require.resolve('../views/patrons/loans.pug');
  res.render(view, { title: 'Patron Details' });
});

module.exports = patronsRouter;
