var express = require('express');
var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', (req, res, next) => res.render('home', { title: 'Library Manager' }));

module.exports = indexRouter;
