var express = require('express');
var booksRouter = express.Router();

/* REDIRECT to all books. */
booksRouter.get('/', function(req, res, next) {
  res.redirect('/books/all');
});

/* GET all books. */
booksRouter.get('/all', function(req, res, next) {
  var view = require.resolve('../views/books/all.pug');
  res.render(view, { title: 'All Books' });
});

/* GET overdue books. */
booksRouter.get('/overdue', function(req, res, next) {
  var view = require.resolve('../views/books/overdue.pug');
  res.render(view, { title: 'Overdue Books' });
});

/* GET checkout out books. */
booksRouter.get('/checked_out', function(req, res, next) {
  var view = require.resolve('../views/books/checked.pug');
  res.render(view, { title: 'Checked Out' });
});

/* GET form to post a new book. */
booksRouter.get('/new', function(req, res, next) {
  var view = require.resolve('../views/books/new.pug');
  res.render(view, { title: 'New Book' });
});

/* GET book details. */
booksRouter.get('/details', function(req, res, next) {
  var view = require.resolve('../views/books/details.pug');
  res.render(view, { title: 'Book Details' });
});

/* GET form to enter a book return. */
booksRouter.get('/return', function(req, res, next) {
  var view = require.resolve('../views/books/return.pug');
  res.render(view, { title: 'Book Return' });
});

module.exports = booksRouter;
