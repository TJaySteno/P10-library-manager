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
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: /^\d{1,4}$|^$/,
          msg: "Please provide a valid year or leave that field blank"
        }
      }
    },
  }, {timestamps: false, underscored: true});

  // Return a readable date (yyyy-mm-dd)
  Book.now = () => new Date().toISOString().match(/^\d{4}-\d{2}-\d{2}/);

  // Return an array of loans for a given book
  Book.getLoans = (book_id, Loan) => Loan.findAll({ where: { book_id } });

  Book.findBooks = async loans => {
    const books = [];
    for (let i = 0; i < loans.length; i++) {
      const id = loans[i].dataValues.book_id;
      books.push(await Book.findOne({ where: { id }}));
    }
    return books;
  };

  // Format and return validation error options
  Book.valErrOptions = (body, errors) => ({
    book: Book.build(body),
    title: 'New Book',
    errors
  });

  return Book;
};
