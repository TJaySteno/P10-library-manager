var express = require('express');
var booksRouter = express.Router();

/* GET home page. */
booksRouter.get('/', function(req, res, next) {
  res.redirect('/books/all');
});

booksRouter.get('/all', function(req, res, next) {
  var view = require.resolve('../views/books/all.pug');
  res.render(view, { title: 'All Books' });
});

booksRouter.get('/checked_out', function(req, res, next) {
  var view = require.resolve('../views/books/checked.pug');
  res.render(view, { title: 'Checked Out' });
});

booksRouter.get('/overdue', function(req, res, next) {
  var view = require.resolve('../views/books/overdue.pug');
  res.render(view, { title: 'Overdue Books' });
});

booksRouter.get('/new', function(req, res, next) {
  var view = require.resolve('../views/books/new.pug');
  res.render(view, { title: 'New Book' });
});

booksRouter.get('/details', function(req, res, next) {
  var view = require.resolve('../views/books/details.pug');
  res.render(view, { title: 'Book Details' });
});

module.exports = booksRouter;
