'use strict';

const express = require('express');
const booksRouter = express.Router();
const Op = require('sequelize').Op;

const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;

/* Reroute calls to '/books' */
booksRouter.get('/', (req, res, next) => res.redirect('/books/all'));

/* GET all books. */
booksRouter.get('/all', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('books/book-list', { books, title: 'Book Listing Page' });
  } catch (err) { next(err); }
});

/* GET overdue books. */
booksRouter.get('/overdue', async (req, res, next) => {
  try {
    const overdue = { attributes: ['book_id'], where: Loan.isOverdue(Op) };
    // const overdueLoans = await Loan.findAll(overdue);
    const books = await Book.getBooks(overdue);
    res.render('books/book-list', { books, title: 'Overdue Books' });
  } catch (err) { next(err); }
});

/* GET books that are currently checked out. */
booksRouter.get('/checked_out', async (req, res, next) => {
  try {
    const notReturned = { attributes: ['book_id'], where: { returned_on: { [Op.eq]: null } } };
    const notReturnedLoans = await Loan.findAll(notReturned);
    const books = await Book.getBooks(notReturnedLoans);
    res.render('books/book-list', { books, title: 'Books Lent Out' });
  } catch (err) { next(err); }
});

/* GET form to create a new book. */
booksRouter.get('/details/new', (req, res, next) =>
  res.render('books/book-details', { book: {}, title: 'New Book' }));

/* POST form to create a new book. */
booksRouter.post('/details/new', async (req, res, next) => {
  try {
    await Book.create(req.body);
    res.redirect('/books/all');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const options = Book.valErrOptions(req.body, err.errors);
      res.render('books/book-details', options);
    } else { next(err); }
  }
});

/* GET a book's details. */
booksRouter.get('/details/:id', async (req, res, next) => {
  try {
    const rawBook = await Book.findByPk(req.params.id);
    const book = rawBook.dataValues;
    if (!book) throw new Error('Book not found');
    const rawLoans = await Loan.findAll({ where: { book_id: book.id } });
    const loans = await Loan.getTitleAndName(rawLoans, Book, Patron);
    const title = `Book Details: ${book.title}`;
    res.render('books/book-details', { title, book, loans });
  } catch (err) { next(err); }
});

/* POST updated book details. */
booksRouter.post('/details/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) throw new Error('Book not found');
    await book.update(req.body);
    res.redirect('/books/details/' + book.id);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      try {
        const options = Book.valErrOptions(req.body, err.errors);
        options.book.id = req.params.id;
        options.title = `Book Details: ${req.body.title}`;
        const rawLoans = await Loan.findAll({ where: { book_id: options.book.id } });
        options.loans = await Loan.getTitleAndName(rawLoans, Book, Patron);
        res.render('books/book-details', options);
      } catch (e) { next(e); }
    } else { next(err); }
  }
});

/* GET book-return form. */
booksRouter.get('/return/:id', async (req, res, next) => {
  try {
    const rawLoan = [await Loan.findByPk(req.params.id)];
    const fullLoan = await Loan.getTitleAndName(rawLoan, Book, Patron);
    const loan = fullLoan[0].dataValues;
    if (!loan) throw new Error('Unable to find this loan');
    loan.title = `Return Book: ${loan.book_title}`;
    loan.now = Loan.date('now');
    res.render('books/book-return', loan);
  } catch (err) { next(err); }
});

/* POST book-return form. */
booksRouter.post('/return/:id', async (req, res, next) => {
  try {
    if (!req.body.returned_on) {
      const err = new Error();
      err.name = 'SequelizeValidationError';
      throw err;
    }

    const loan = await Loan.findByPk(req.params.id);
    if (!loan) throw new Error('Unable to find this loan');
    await loan.update(req.body);
    res.redirect('/loans/all');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      try {
        const rawLoan = [await Loan.findByPk(req.params.id)];
        const fullLoan = await Loan.getTitleAndName(rawLoan, Book, Patron);
        const loan = fullLoan[0].dataValues;
        if (!loan) next(new Error('Unable to find this loan'));
        loan.title = `Return Book: ${loan.book_title}`;
        loan.now = Loan.date('now');
        loan.error = 'Returned on: enter a valid end date';
        res.render('books/book-return', loan);
      } catch (e) { next(e); }
    } else { next(err); }
  }
});

module.exports = booksRouter;
