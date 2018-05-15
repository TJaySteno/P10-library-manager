const express = require('express');
const loansRouter = express.Router();
const Loan = require('../models').Loan;
const Book = require('../models').Book;
const Patron = require('../models').Patron;

/* Reroute calls to '/loans' */
loansRouter.get('/', (req, res, next) => res.redirect('/loans/all'));

/* GET all loans. */
loansRouter.get('/all', (req, res, next) => {
  Loan.findAll().then(loans => {
    console.log(loans[0].dataValues);
    res.render('loans/loan-list', {
      title: 'All Loans',
      loans
    })
  })
  .catch(err => res.send(500));
});

/* GET overdue loans. */
loansRouter.get('/overdue', (req, res, next) => {
  res.render('loans/loan-list', {
    title: 'All Loans',
    loans: [
      {
        book: {},
        loan: {}
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
        loan: {}
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

/* POST form to create a new loan. */
loansRouter.post('/new', (req, res, next) => {
  Loan.create(req.body)
    .then(loan => res.redirect('/loans/all'))
    .catch(err => {
      console.log(err);
      if (err.name === "SequelizeValidationError") {
        res.render('loans/loan-details', {
          loan: Loan.build(req.body),
          title: 'New Loan',
          errors: err.errors
        });
      } else { throw err; }
    })
    .catch(err => res.send(500));
});

module.exports = loansRouter;
