'use strict';

module.exports = (sequelize, DataTypes) => {
  var Loan = sequelize.define('Loan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      isInt: { msg: "Please select a book to check out" }
    },
    book_title: DataTypes.STRING,
    patron_id: {
      type: DataTypes.INTEGER,
      isInt: { msg: "Please select a patron" }
    },
    patron_name: DataTypes.STRING,
    loaned_on: {
      type: DataTypes.DATEONLY,
      isDate: { msg: "Please enter a valid date for the start of this loan" }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      isDate: { msg: "Please enter a valid date for the end of this loan" }
    },
    returned_on: DataTypes.DATEONLY
  }, {timestamps: false, underscored: true});

  // Return a readable date (yyyy-mm-dd)
  Loan.date = field => {
    let date = new Date();
    if (field === 'return_by') date.setDate(date.getDate() + 7);
    return date.toISOString().match(/^\d{4}-\d{2}-\d{2}/);
  }

  Loan.createNewLoan = body => {
    const book = body.book_info.split('-');
    const patron = body.patron_info.split('-');
    const { loaned_on, return_by, returned_on } = body;
    const new_loan = {
      book_id: book[0],
      book_title: book[1],
      patron_id: patron[0],
      patron_name: patron[1],
      loaned_on,
      return_by
    }
    if (returned_on) new_loan.returned_on = returned_on;

    // Exclude books that have already been loaned out

    return new_loan;
  }

  Loan.associate = models => {
    
  }

  return Loan;
};


// book id, title
// patron id, name
