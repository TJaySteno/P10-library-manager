const express = require('express');
const booksRouter = express.Router();
const Book = require('../models').Book;

/* Reroute calls to '/books' */
booksRouter.get('/', (req, res, next) => res.redirect('/books/all'));

/* GET all books. */
booksRouter.get('/all', (req, res, next) => {
  Book.findAll()
    .then(books => {
      res.render('books/book-list', {
        title: 'Book Listing Page',
        books
      });
    })
    .catch(err => res.send(500));
});

/* GET overdue books. */
booksRouter.get('/overdue', (req, res, next) => {
  Book.findAll({
      where: {
        // overdue: true
        id: 1
      }})
    .then(books => {
      res.render('books/book-list', { books: books, title: 'All Books' });
    })
    .catch(err => res.send(500));
});

/* GET checkout out books. */
booksRouter.get('/checked_out', (req, res, next) => {
  Book.findAll({ where: { id: 2 }})
    .then(books => {
      res.render('books/book-list', { books: books, title: 'All Books' });
    })
    .catch(err => res.send(500));
});

/* GET form to allow creation of a new book. */
booksRouter.get('/details/new', (req, res, next) => {
  res.render('books/book-details', {
    book: {},
    title: 'New Book'
  });
});

/* POST form to create a new book. */
booksRouter.post('/details/new', (req, res, next) => {
  Book.create(req.body)
    .then(book => res.redirect('/books/all'))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render('books/book-details', {
          book: Book.build(req.body),
          title: 'New Book',
          errors: err.errors
        });
      } else { throw err; }
    })
    .catch(err => res.send(500));
});

/* GET book details. */
booksRouter.get('/details/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (book) {
        res.render('books/loan-history', {
          title: book.dataValues.title,
          book: book.dataValues,
          loans: []
        });
      } else {
        res.send(404);
      }
    })
    .catch(err => res.send(500));
});

/* POST new book details to update its DB row. */
booksRouter.post('/details/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (book) return book.update(req.body);
      else res.send(404)
    })
    .then(book => res.redirect('/books/details/' + book.id))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        const book = Book.build(req.body);
        book.id = req.params.id;

        res.render('books/loan-history', {
          title: book.title,
          book,
          loans: [],
          errors: err.errors
        });
      } else { throw err; }
    })
    .catch(err => res.send(500));
});

/* GET form to enter a book return. */
booksRouter.get('/return', (req, res, next) => {
  // Attach a loan here
  res.render('books/book-return', {
    title: 'Book Return',
    patron: 'Joe',
    loaned_on: 'Tuesday or whatever',
    return_by: 'Wednesday or else',
    now: Book.now()
  });
});

module.exports = booksRouter;
