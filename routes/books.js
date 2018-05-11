const express = require('express');
const booksRouter = express.Router();
const Book = require('../models').Book;

/* REDIRECT to all books. */
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
  Book.findAll().then(books => {
    // filter by overdue
    res.render('books/books-list', { books: books, title: 'All Books' });
  });
});

/* GET checkout out books. */
booksRouter.get('/checked_out', (req, res, next) => {
  Book.findAll().then(books => {
    // filter by checked out
    res.render('books/books-list', { books: books, title: 'All Books' });
  });
});

/* GET form to post a new book. */
booksRouter.get('/new', (req, res, next) => {
  res.render('books/book-details', { book: Book.build(), title: 'New Book' });
});

/* GET form to post a new book. */
booksRouter.post('/new', (req, res, next) => {
  Book.create(req.body).then(book => {
    res.redirect('/books/details/' + book.id);
  });
});

/* GET form to post a new book. */
booksRouter.post('/details/:id', function (req, res, next) {
  Book.create(req.body).then(book => {
    res.redirect('/books/details/' + book.id);
  });
});

/* GET book details. */
booksRouter.get('/details/:id', (req, res, next) => {
  Book.findById(req.params.id).then(book => {
    res.render('books/loan-history', {
      book: book.dataValues,
      title: book.dataValues.title
    });
  });
});




// /* GET individual article. */
// router.get("/:id", function(req, res, next){
//   Article.findById(req.params.id).then(function(article){
//     if(article) {
//       res.render("articles/show", {article: article, title: article.title});
//     } else {
//       res.send(404);
//     }
//   }).catch(function(error){
//       res.send(500, error);
//    });
// });

/* GET form to post a new book. */
booksRouter.post('/details', (req, res, next) => {
  Book.create(req.body).then(book => {
    res.redirect('/books/details/' + book.id);
  });
});

/* GET form to enter a book return. */
booksRouter.get('/return', (req, res, next) => {
  const view = require.resolve('../views/books/return.pug');
  res.render(view, { title: 'Book Return' });
});

module.exports = booksRouter;
