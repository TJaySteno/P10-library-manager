const express = require('express');
const booksRouter = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;

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
    .catch(err => console.log(err));
});

/* GET overdue books. */
booksRouter.get('/overdue', (req, res, next) => {
  Book.findAll({
      where: {
        // return_by < today
      }})
    .then(books => {
      res.render('books/book-list', { books: books, title: 'Overdue Books' });
    })
    .catch(err => console.log(err));
});

/* GET checkout out books. */
booksRouter.get('/checked_out', (req, res, next) => {
  Book.findAll({
      where: {
        // !returned_on
      }
    })
    .then(books => res.render('books/book-list', { books, title: 'Books Lent Out' }))
    .catch(err => console.log(err));
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
  console.log(req.body);
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
    .catch(err => console.log(err));
});

/* GET book details. */
booksRouter.get('/details/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (!book) res.send(404);
      else {
        Loan.findAll({ where: { book_id: book.id } })
        .then(loans => {
          res.render('books/book-details', {
            title: book.dataValues.title,
            book: book.dataValues,
            loans
          });
        })
      }
    })
    .catch(err => console.log(err));
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
        Loan.findAll({ where: { book_id: book.id } })
          .then(loans => {
            const book = Book.build(req.body);
            book.id = req.params.id;
            const { title } = book;

            res.render('books/book-loans', {
              title,
              book,
              loans: [],
              errors: err.errors
            });
          })
          .catch(err => console.log(err));
      } else { throw err; }
    })
    .catch(err => console.log(err));
});

/* GET form to enter a book return. */
booksRouter.get('/return/:id', (req, res, next) => {
  Loan.findById(req.params.id)
    .then(loan => {
      loan.dataValues.title = loan.book_title;
      loan.dataValues.now = Book.now();
      res.render('books/book-return', loan.dataValues);
    })
    .catch(err => console.log(err));
});

/* POST book return form. */
booksRouter.post('/return/:id', (req, res, next) => {
  Loan.findById(req.params.id)
    .then(loan => loan.update(req.body))
    .then(() => res.redirect('/loans/all'))
    .catch(err => console.log(err));
})

module.exports = booksRouter;
