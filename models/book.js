'use strict';

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Title: enter a title' },
      },
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Author: enter an author' },
      },
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Genre: enter a genre' },
      },
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: /^\d{1,4}$|^$/,
          msg: 'First Published: leave this field blank or enter a valid year (1-4 digits)',
        },
      },
    },
  }, {
    timestamps: false,
    underscored: true,
  });

  /* Return an array of loans for a given book */
  Book.getLoans = (book_id, Loan) => Loan.findAll({ where: { book_id } });

  /* Return an array of books of an array of loans containing book ids */
  Book.getBooks = async loans => {
    const books = [];
    for (let i = 0; i < loans.length; i++) {
      const id = loans[i].dataValues.book_id;
      books.push(await Book.findOne({ where: { id } }));
    }

    return books;
  };

  /* Format and return validation error options */
  Book.valErrOptions = (body, errors) => ({
    book: Book.build(body),
    title: 'New Book',
    errors,
  });

  return Book;
};
