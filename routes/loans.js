const express = require('express');
const loansRouter = express.Router();
const Patron = require('../models').Patron;

/* REDIRECT to all loans. */
loansRouter.get('/', (req, res, next) => {
  res.redirect('/loans/all');
});

/* GET all loans. */
loansRouter.get('/all', (req, res, next) => {
  const view = require.resolve('../views/loans/all.pug');
  res.render(view, { title: 'All Loans' });
});

/* GET overdue loans. */
loansRouter.get('/overdue', (req, res, next) => {
  const view = require.resolve('../views/loans/overdue.pug');
  res.render(view, { title: 'Overdue Loans' });
});

/* GET loaned books. */
loansRouter.get('/checked_out', (req, res, next) => {
  const view = require.resolve('../views/loans/checked.pug');
  res.render(view, { title: 'Loaned Books' });
});

/* GET form to create a new loan. */
loansRouter.get('/new', (req, res, next) => {
  const view = require.resolve('../views/loans/new.pug');
  res.render(view, { title: 'New Loan' });
});

module.exports = loansRouter;
