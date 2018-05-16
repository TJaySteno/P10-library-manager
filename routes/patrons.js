const express = require('express');
const patronsRouter = express.Router();
const Patron = require('../models').Patron;
const Loan = require('../models').Loan;

/* Reroute calls to '/patrons' */
patronsRouter.get('/', (req, res, next) => res.redirect('/patrons/all'));

/* GET all patrons. */
patronsRouter.get('/all', (req, res, next) => {
  Patron.findAll().then(patrons => {
    res.render('patrons/patron-list', {
      title: 'Patrons Listing Page',
      patrons
    });
  })
  .catch(err => res.send(500));
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
    // update full name
    .then(patron => res.redirect('/patrons/all'))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render('patrons/patron-details', {
          patron: Patron.build(req.body),
          title: 'New Patron',
          errors: err.errors
        });
      } else { throw err; }
    })
    .catch(err => res.send(500));
});

/* GET patron details. */
patronsRouter.get('/details/:id', (req, res, next) => {
  Patron.findById(req.params.id)
    .then(patron => {
      if (!patron) res.send(404);
      else {
        Loan.findAll({ where: { patron_id: patron.id } })
        .then(loans => {
          const title = `Patron Details: ${patron.dataValues.first_name} ${patron.dataValues.last_name}`;
          res.render('patrons/patron-details', {
            patron: patron.dataValues,
            title,
            loans
          });
        })
      }
    })
    .catch(err => res.send(500));
});

/* POST new patron details to update its DB row. */
patronsRouter.post('/details/:id', (req, res, next) => {
  Patron.findById(req.params.id)
    .then(patron => patron.update(req.body))
    .then(patron => res.redirect('/patrons/all'))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        const patron = Patron.build(req.body);
        patron.id = req.params.id;

        res.render('patrons/patron-details', {
          title: patron.title,
          patron,
          loans: [],
          errors: err.errors
        });
      } else { throw err; }
    })
    .catch(err => res.send(500));
});

module.exports = patronsRouter;
