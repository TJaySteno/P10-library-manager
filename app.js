'use strict';

const createError = require('http-errors');
const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const loansRouter = require('./routes/loans');
const patronsRouter = require('./routes/patrons');

const app = express();

/* view engine setup */
app.set('views', './views');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/loans', loansRouter);
app.use('/patrons', patronsRouter);

/* catch 404 and forward to error handler */
app.use(function (req, res, next) {
  next(createError(404));
});

/* error handler */
app.use(function (err, req, res, next) {
  const message = err.msg || err.message;

  /* render the error page */
  res.status(err.status || 500);
  console.log(res.locals);
  res.render('error', {
    title: err.message,
    status: res.statusCode,
    message,
    error: err,
  });
});

module.exports = app;
