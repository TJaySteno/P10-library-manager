'use strict';

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Please provide a title" },
        isAlphanumeric: { msg: "Title must only contain letters or numbers" }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Please provide an author" },
        isAlpha: { msg: "Author must only contain letters" }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Please provide the genre" },
        isAlpha: { msg: "Genre must only contain letters" }
      }
    },
    first_published: DataTypes.INTEGER
  }, {timestamps: false, underscored: true});

  // Return a readable date (yyyy-mm-dd)
  Book.now = () => new Date().toISOString().match(/^\d{4}-\d{2}-\d{2}/);

  return Book;
};
