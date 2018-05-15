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
    patron_id: {
      type: DataTypes.INTEGER,
      isInt: { msg: "Please select a patron" }
    },
    loaned_on: {
      type: DataTypes.DATE,
      isDate: { msg: "Please enter a valid date for the start of this loan" }
    },
    return_by: {
      type: DataTypes.DATE,
      isDate: { msg: "Please enter a valid date for the end of this loan" }
    },
    returned_on: DataTypes.DATE
  });

  // Return a readable date (yyyy-mm-dd)
  Loan.date = field => {
    let date = new Date();
    if (field === 'return_by') date.setDate(date.getDate() + 7);
    return date.toISOString().match(/^\d{4}-\d{2}-\d{2}/);
  }

  Loan.associate = function(models) {
    // associations can be defined here
  };

  return Loan;
};
