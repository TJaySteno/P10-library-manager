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
    res.render('loans/loan-list', {
      title: 'Loans Listing Page',
      loans
    })
  })
  .catch(err => next(err));
});

/* GET overdue loans. */
loansRouter.get('/overdue', (req, res, next) => {
  Loan.findAll({
    // where return_by > now
  }).then(loans => {
    res.render('loans/loan-list', {
      title: 'Overdue Loans',
      loans
    })
  })
  .catch(err => next(err));
});

/* GET loaned books. */
loansRouter.get('/checked_out', (req, res, next) => {
  Loan.findAll({
    // where !returned_on
  }).then(loans => {
    res.render('loans/loan-list', {
      title: 'Books Lent Out',
      loans
    })
  })
  .catch(err => next(err));
});

/* GET form to create a new loan. */
loansRouter.get('/new', (req, res, next) => {
  const options = {
    title: 'New Loan',
    loaned_on: Loan.date('loaned_on'),
    return_by: Loan.date('return_by')
  };
  Book.findAll({ attributes: ['id', 'title'] })
    .then(books => options.books = books)
    .then(() => Patron.findAll({ attributes: ['id', 'first_name', 'last_name'] })
      .then(patrons => options.patrons = patrons))
    .then(() => res.render('loans/loan-new', options));
});

/* POST form to create a new loan. */
loansRouter.post('/new', (req, res, next) => {
  const new_loan = Loan.createNewLoan(req.body);
  // this doesn't update when book or patron is edited
    // need to pull name/title each time

  Loan.create(new_loan)
    .then(loan => res.redirect('/loans/all'))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        const loan = Book.build(req.body);
        loan.id = req.params.id;

        res.render('loans/loan-loans', {
          title: loan.title,
          loan,
          loans: [],
          errors: err.errors
        });
      } else { throw err; }
    })
    .catch(err => console.log(err));
});

module.exports = loansRouter;
