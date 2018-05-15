'use strict';

module.exports = (sequelize, DataTypes) => {
  // http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations
  // https://github.com/chriso/validator.js
  try {
    const Book = sequelize.define('Book', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Please provide a title" }
        }
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Please provide an author" }
        }
      },
      genre: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "Please provide the genre" }
        }
      },
      first_published: DataTypes.INTEGER
    });

    // Return a readable date (mmm dd yyyy)
    Book.now = () =>
    new Date().toString()
    .split(/^\w{3}\s/)[1]
    .split(/\s\d{2}:\d{2}:\d{2}/)[0]

    Book.associate = function(models) {
      // associations can be defined here
    };

    return Book;

  } catch (err) { throw err; }
};
