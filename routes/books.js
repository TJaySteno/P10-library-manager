const express = require('express');
const booksRouter = express.Router();
const Book = require('../models').Book;

/* Reroute to view all books. */
booksRouter.get('/', (req, res, next) => {
  res.redirect('/books/all');
});

/* GET all books. */
booksRouter.get('/all', (req, res, next) => {
  Book.findAll().then(books => {
    res.render('books/books-list', { books: books, title: 'All Books' });
  });
});

/* GET overdue books. */
booksRouter.get('/overdue', (req, res, next) => {
  Book.findAll({
    where: {
      id: 1
      // overdue: true
    }
  }).then(books => {
    res.render('books/books-list', { books: books, title: 'All Books' });
  });
});

/* GET checkout out books. */
booksRouter.get('/checked_out', (req, res, next) => {
  Book.findAll({
    where: {
      id: 2
      // checked_out: true
    }
  }).then(books => {
    res.render('books/books-list', { books: books, title: 'All Books' });
  });
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
    .then(book => {
      res.redirect('/books/details/' + book.id);
  });
});

/* GET book details. */
booksRouter.get('/details/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      res.render('books/loan-history', {
        title: book.dataValues.title,
        book: book.dataValues,
        loans: []
      });
    });
});

/* POST new book details to update its DB row. */
booksRouter.post('/details/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      book.update(req.body);
      return book;
    })
    .then(book => {
      res.redirect('/books/details/' + book.id);
    });
});

/* GET form to enter a book return. */
booksRouter.get('/return', (req, res, next) => {
  const regexDay = /^\w{3}\s/;
  const regexTime = /\d{2}:\d{2}:\d{2}/;

  const date = new Date().toString();
  const now = date.split(regexDay)[1].split(regexTime)[0];

  res.render('books/return', {
    title: 'Book Return',
    patron: 'Joe',
    loaned_on: 'Tuesday or whatever',
    return_by: 'Wednesday or else',
    now
  });
});

module.exports = booksRouter;
