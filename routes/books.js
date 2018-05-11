var express = require('express');
var booksRouter = express.Router();

/* GET home page. */
booksRouter.get('/books', function(req, res, next) {
  res.redirect('/all');
});

booksRouter.get('/books/all', function(req, res, next) {
  res.render('books/all-books', { title: 'Books' });
});

module.exports = booksRouter;
