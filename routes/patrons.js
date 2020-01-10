'use strict';

const express = require('express');
const patronsRouter = express.Router();

const Patron = require('../models').Patron;
const Book = require('../models').Book;
const Loan = require('../models').Loan;

/* Reroute calls to '/patrons' */
patronsRouter.get('/', (req, res, next) => res.redirect('/patrons/all'));

/* GET all patrons. */
patronsRouter.get('/all', async (req, res, next) => {
  try {
    const patrons = await Patron.findAll();
    res.render('patrons/patron-list', { patrons, title: 'Patrons Listing Page' });
  } catch (err) { next(err); }
});

/* GET form to create a new patron. */
patronsRouter.get('/details/new', (req, res, next) =>
  res.render('patrons/patron-details', { patron: {}, title: 'New Patron' }));

/* POST form to create a new patron. */
patronsRouter.post('/details/new', async (req, res, next) => {
  try {
    const patron = await Patron.create(req.body);
    res.redirect('/patrons/all');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const options = Patron.valErrOptions(req.body, err.errors);
      res.render('patrons/patron-details', options);
    } else { next(err); }
  }
});

/* GET a patron's details. */
patronsRouter.get('/details/:id', async (req, res, next) => {
  try {
    const rawPatron = await Patron.findById(req.params.id);
    const patron = rawPatron.dataValues;
    if (!patron) throw new Error('Patron not found');
    const rawLoans = await Loan.findAll({ where: { patron_id: patron.id } });
    const loans = await Loan.getTitleAndName(rawLoans, Book, Patron);
    const title = `Patron Details: ${patron.first_name} ${patron.last_name}`;
    res.render('patrons/patron-details', { patron, title, loans });
  } catch (err) { next(err); }
});

/* POST updated patron details. */
patronsRouter.post('/details/:id', async (req, res, next) => {
  try {
    const patron = await Patron.findById(req.params.id);
    if (!patron) throw new Error('Patron not found');
    await patron.update(req.body);
    res.redirect('/patrons/all');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      try {
        const options = Patron.valErrOptions(req.body, err.errors);
        options.patron.id = req.params.id;
        options.title = `Patron Details: ${req.body.first_name} ${req.body.last_name}`;
        const rawLoans = await Loan.findAll({ where: { patron_id: options.patron.id } });
        options.loans = await Loan.getTitleAndName(rawLoans, Book, Patron);
        res.render('patrons/patron-details', options);
      } catch (e) { next(e); }
    } else { next(err); }
  }
});

module.exports = patronsRouter;
