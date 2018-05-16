const express = require('express');
const booksRouter = express.Router();
const Op = require('sequelize').Op;

const Book = require('../models').Book;
const Loan = require('../models').Loan;

/* Reroute calls to '/books' */
booksRouter.get('/', (req, res, next) => res.redirect('/books/all'));

/* GET all books. */
booksRouter.get('/all', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('books/book-list', { books, title: 'Book Listing Page' });
  } catch (err) { next(err) }
});

/* GET overdue books. */
booksRouter.get('/overdue', async (req, res, next) => {
  try {
    const overdueBooks = {
      attributes: ['book_id'],
      where: { return_by: { [Op.lt]: Book.now()[0] }}
    };
    const overdue = await Loan.findAll(overdueBooks);
    const books = await Book.findBooks(overdue);
    res.render('books/book-list', { books, title: 'Overdue Books' });
  } catch (err) { next(err) }
});

/* GET checkout out books. */
booksRouter.get('/checked_out', async (req, res, next) => {
  try {
    const booksNotReturned = {
      attributes: ['book_id'],
      where: { returned_on: { [Op.eq]: null }}
    };
    const notReturned = await Loan.findAll(booksNotReturned);
    const books = await Book.findBooks(notReturned);
    res.render('books/book-list', { books, title: 'Books Lent Out' });
  } catch (err) { next(err) }
});

/* GET form to allow creation of a new book. */
booksRouter.get('/details/new', (req, res, next) =>
  res.render('books/book-details', { book: {}, title: 'New Book' }));

/* POST form to create a new book. */
booksRouter.post('/details/new', async (req, res, next) => {
  try {
    await Book.create(req.body);
    res.redirect('/books/all');
  } catch (err) {
    err.name === "SequelizeValidationError"
      ? res.render('books/book-details', Book.valErrOptions(req.body, err.errors))
      : next(err)
  }
});

/* GET book details. */
booksRouter.get('/details/:id', async (req, res, next) => {
  try {
    const rawBook = await Book.findById(req.params.id);
    const book = rawBook.dataValues;
    console.log(book);
    if (!book) throw new Error('Book not found');
    const loans = await Loan.findAll({ where: { book_id: book.id } });
    const title = `Book Details: ${book.title}`;
    res.render('books/book-details', { title, book, loans });
  } catch (err) { next(err) }
});

/* POST new book details to update its DB row. */
booksRouter.post('/details/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw new Error('Book not found');
    await book.update(req.body);
    res.redirect('/books/details/' + book.id);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const options = Book.valErrOptions(req.body, err.errors);
      options.book.id = req.params.id;
      options.title = `Book Details: ${req.body.title}`;
      options.loans = await Book.getLoans(req.params.id, Loan);
      res.render('books/book-details', options);
    } else { next(err) }
  }
});

/* GET form to enter a book return. */
booksRouter.get('/return/:id', async (req, res, next) => {
  try {
    const rawLoan = await Loan.findById(req.params.id);
    const loan = rawLoan.dataValues;
    if (!loan) throw new Error('Unable to find this loan');
    loan.title = `Return Book: ${loan.book_title}`;
    loan.now = Book.now();
    res.render('books/book-return', loan);
  } catch (err) { next(err) }
});

/* POST book return form. */
booksRouter.post('/return/:id', async (req, res, next) => {
  try {
    if (!req.body.returned_on) {
      const err = new Error();
      err.name = "SequelizeValidationError";
      throw err;
    }
    const loan = await Loan.findById(req.params.id);
    if (!loan) throw new Error('Unable to find this loan');
    await loan.update(req.body);
    res.redirect('/loans/all')
  } catch (err) {
    try {
      if (err.name === "SequelizeValidationError") {
        const rawLoan = await Loan.findById(req.params.id);
        const loan = rawLoan.dataValues;
        if (!loan) next(new Error('Unable to find this loan'));
        loan.title = `Return Book: ${loan.book_title}`;
        loan.now = Book.now();
        loan.error = "Please provide a valid return date (yyyy-mm-dd) or leave that field blank";
        res.render('books/book-return', loan);
      } else { next(err) }
    } catch (e) { next(e) }
  }
})

module.exports = booksRouter;
