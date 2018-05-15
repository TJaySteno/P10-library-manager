const express = require('express');
const loansRouter = express.Router();
const Loan = require('../models').Loan;
const Book = require('../models').Book;
const Patron = require('../models').Patron;

/* REDIRECT to all loans. */
loansRouter.get('/', (req, res, next) => {
  res.redirect('/loans/all');
});

/* GET all loans. */
loansRouter.get('/all', (req, res, next) => {
  res.render('loans/loan-list', {
    title: 'All Loans',
    loans: [
      {
        book: {},
        patron: {}
      }
    ]
  });
});

/* GET overdue loans. */
loansRouter.get('/overdue', (req, res, next) => {
  res.render('loans/loan-list', {
    title: 'All Loans',
    loans: [
      {
        book: {},
        patron: {}
      }
    ]
  });
});

/* GET loaned books. */
loansRouter.get('/checked_out', (req, res, next) => {
  res.render('loans/loan-list', {
    title: 'All Loans',
    loans: [
      {
        book: {},
        patron: {}
      }
    ]
  });
});

/* GET form to create a new loan. */
loansRouter.get('/new', (req, res, next) => {
  res.render('loans/loan-new', {
    title: 'New Loan',
    books: [],
    patrons: [],
    loaned_on: Loan.date('loaned_on'),
    return_by: Loan.date('return_by')
  });
});

module.exports = loansRouter;
