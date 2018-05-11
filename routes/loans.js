var express = require('express');
var loansRouter = express.Router();

/* GET home page. */
loansRouter.get('/', function(req, res, next) {
  res.redirect('/loans/all');
});

loansRouter.get('/all', function(req, res, next) {
  var view = require.resolve('../views/loans/all.pug');
  res.render(view, { title: 'All Loans' });
});

loansRouter.get('/overdue', function(req, res, next) {
  var view = require.resolve('../views/loans/overdue.pug');
  res.render(view, { title: 'Overdue Loans' });
});

loansRouter.get('/checked_out', function(req, res, next) {
  var view = require.resolve('../views/loans/checked.pug');
  res.render(view, { title: 'Loaned Books' });
});

loansRouter.get('/new', function(req, res, next) {
  var view = require.resolve('../views/loans/new.pug');
  res.render(view, { title: 'New Loan' });
});

module.exports = loansRouter;
