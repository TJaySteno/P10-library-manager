const express = require('express');
const loansRouter = express.Router();
const Op = require('sequelize').Op;

const Loan = require('../models').Loan;
const Book = require('../models').Book;
const Patron = require('../models').Patron;

/* Reroute calls to '/loans' */
loansRouter.get('/', (req, res, next) => res.redirect('/loans/all'));

/* GET all loans. */
loansRouter.get('/all', async (req, res, next) => {
  try {
    const rawLoans = await Loan.findAll();
    const loans = await Loan.getTitleAndName(rawLoans, Book, Patron);
    res.render('loans/loan-list', { loans, title: 'Loans Listing Page' });
  } catch (err) { next(err) }
});

/* GET overdue loans. */
loansRouter.get('/overdue', async (req, res, next) => {
  try {
    const overdueLoans = { where: Loan.isOverdue(Op) };
    const rawLoans = await Loan.findAll(overdueLoans);
    const loans = await Loan.getTitleAndName(rawLoans, Book, Patron);
    res.render('loans/loan-list', { loans, title: 'Overdue Loans' });
  } catch (err) { next(err) }
});

/* GET current loans. */
loansRouter.get('/checked_out', async (req, res, next) => {
  try {
    const booksNotReturned = { where: { returned_on: { [Op.eq]: null }}};
    const rawLoans = await Loan.findAll(booksNotReturned);
    const loans = await Loan.getTitleAndName(rawLoans, Book, Patron);
    res.render('loans/loan-list', { loans, title: 'Books Lent Out' });
  } catch (err) { next(err) }
});

/* GET form to create a new loan. */
loansRouter.get('/new', async (req, res, next) => {
  try {
    const options = Loan.newLoanOptions();
    options.books = await Book.findAll({ attributes: ['id', 'title'] });
    options.patrons = await Patron.findAll({ attributes: ['id', 'first_name', 'last_name'] });
    res.render('loans/loan-new', options);
  } catch (err) { next(err) }
});

/* POST form to create a new loan. */
loansRouter.post('/new', async (req, res, next) => {
  try {
    if (!req.body.returned_on) delete req.body.returned_on;
    const alreadyLoanedBook = { where: {
      book_id: req.body.book_id,
      returned_on: { [Op.eq]: null }
    }};
    if (await Loan.findOne(alreadyLoanedBook)) {
      const err = new Error('BookNotAvailable');
      err.errors = [{ message: 'Book: This book is already being borrowed' }];
      throw err;
    }
    await Loan.create(req.body);
    res.redirect('/loans/all');
  } catch (err) {
    if (err.name === "SequelizeValidationError" || err.message === 'BookNotAvailable') {
      try {
        const options = Loan.newLoanOptions();
        options.books = await Book.findAll({ attributes: ['id', 'title'] });
        options.patrons = await Patron.findAll({ attributes: ['id', 'first_name', 'last_name'] });
        options.errors = err.errors;
        res.render('loans/loan-new', options);
      } catch (e) { next(e) }
    } else { next(err) }
  }
});

module.exports = loansRouter;
