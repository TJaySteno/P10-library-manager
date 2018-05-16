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
        notEmpty: { msg: "Please provide a first name" },
        isAlpha: { msg: "First name must only contain letters" }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Please provide a last name" },
        isAlpha: { msg: "Last name must only contain letters" }
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
          args: [["^MCL[0-9]{4}$"]],
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

  return Patron;
};
