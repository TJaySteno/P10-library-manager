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
        notEmpty: { msg: "First Name: enter a first name" }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Last Name: enter a last name" }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Address: enter an address" }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { msg: "Email: enter a valid email" }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^MCL\d{4}$/,
          msg: "Library ID: enter a valid ID ('MCL####')"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: [["^[0-9]{5}$"]],
          msg: "Zip Code: enter a valid Zip ('#####')"
        }
      }
    }
  }, {timestamps: false, underscored: true});

  // Return an array of loans for a given patron
  Patron.getLoans = (patron_id, Loan) => Loan.findAll({ where: { patron_id } });

  // Format and return validation error options
  Patron.valErrOptions = (body, errors) => ({
    patron: Patron.build(body),
    title: 'New Patron',
    errors
  });

  return Patron;
};
