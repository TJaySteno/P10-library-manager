var express = require('express');
var loansRouter = express.Router();

/* REDIRECT to all loans. */
loansRouter.get('/', function(req, res, next) {
  res.redirect('/loans/all');
});

/* GET all loans. */
loansRouter.get('/all', function(req, res, next) {
  var view = require.resolve('../views/loans/all.pug');
  res.render(view, { title: 'All Loans' });
});

/* GET overdue loans. */
loansRouter.get('/overdue', function(req, res, next) {
  var view = require.resolve('../views/loans/overdue.pug');
  res.render(view, { title: 'Overdue Loans' });
});

/* GET loaned books. */
loansRouter.get('/checked_out', function(req, res, next) {
  var view = require.resolve('../views/loans/checked.pug');
  res.render(view, { title: 'Loaned Books' });
});

/* GET form to create a new loan. */
loansRouter.get('/new', function(req, res, next) {
  var view = require.resolve('../views/loans/new.pug');
  res.render(view, { title: 'New Loan' });
});

module.exports = loansRouter;
