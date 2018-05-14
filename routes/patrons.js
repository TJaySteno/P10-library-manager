const express = require('express');
const patronsRouter = express.Router();
const Patron = require('../models').Patron;

/* REDIRECT to all patrons. */
patronsRouter.get('/', (req, res, next) => {
  res.redirect('/patrons/all');
});

/* GET all patrons. */
patronsRouter.get('/all', (req, res, next) => {
  Patron.findAll().then(patrons => {
    res.render('patrons/patron-list', {
      title: 'All Patrons',
      patrons
    });
  });
});

/* GET form to create a new patron. */
patronsRouter.get('/details/new', (req, res, next) => {
  res.render('patrons/patron-details', {
    title: 'New Patron',
    patron: {}
  });
});

/* POST form to create a new patron. */
patronsRouter.post('/details/new', (req, res, next) => {
  Patron.create(req.body)
    .then(patron => {
      res.redirect('/patrons/details/' + patron.id);
  });
});

/* GET patron details. */
patronsRouter.get('/details/:id', (req, res, next) => {
  Patron.findById(req.params.id)
    .then(patron => {
      res.render('patrons/patron-loans', {
        title: patron.dataValues.title,
        patron: patron.dataValues,
        loans: []
      });
    });
});

/* POST new patron details to update its DB row. */
patronsRouter.post('/details/:id', (req, res, next) => {
  Patron.findById(req.params.id)
    .then(patron => patron.update(req.body))
    .then(patron => res.redirect('/patrons/details/' + patron.id));
});

module.exports = patronsRouter;
