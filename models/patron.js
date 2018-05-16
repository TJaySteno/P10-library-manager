'use strict';

module.exports = (sequelize, DataTypes) => {

  var Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Please provide a first name" }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Please provide a last name" }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Please provide an address" }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { msg: "Please provide a valid email" },
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^MCL\d{4}$/,
          msg: "Please enter a valid library ID (MCL####)"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: [["^[0-9]{5}$"]],
          msg: "Please enter a 5 digit zip code"
        }
      }
    }
  }, {timestamps: false, underscored: true});

  // Return an array of loans for a given patron
  Patron.getLoans = (patron_id, Loan) => Loan.findAll({ where: { patron_id } });

  // Return an array of patrons of an array of loans containing patron ids
  Patron.findPatrons = async loans => {
    const patrons = [];
    for (let i = 0; i < loans.length; i++) {
      const id = loans[i].dataValues.patron_id;
      patrons.push(await Patron.findOne({ where: { id }}));
    }
    return patrons;
  };

  // Format and return validation error options
  Patron.valErrOptions = (body, errors) => ({
    patron: Patron.build(body),
    title: 'New Patron',
    errors
  });

  return Patron;
};
