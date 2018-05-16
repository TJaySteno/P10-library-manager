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
      validate: {
        isInt: { msg: "Book: select a book" }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: { msg: "Patron: select a patron" }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: { msg: "Return by: enter a valid start date" }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: { msg: "Return by: enter a valid due date" }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        is: {
          args: /^\d{4}-\d{2}-\d{2}$|^$/,
          msg: "Returned on: enter a valid end date or leave field empty"
        },
      }
    }
  }, {timestamps: false, underscored: true});

  // Return a readable date (yyyy-mm-dd)
  Loan.date = field => {
    let date = new Date();
    if (field === 'return_by') date.setDate(date.getDate() + 7);
    return date.toISOString().match(/^\d{4}-\d{2}-\d{2}/);
  }

  // Return options object for '/loans/new'
  Loan.newLoanOptions = () => ({
    title: 'New Loan',
    loaned_on: Loan.date('now'),
    return_by: Loan.date('return_by')
  });

  // Loop through a 'loans' array to get book titles and patron names
  Loan.getTitleAndName = async (loans, Book, Patron) => {
    try {
      for (let i = 0; i < loans.length; i++) {
        const loanedBook = { attributes: ['title'], where: { id: loans[i].dataValues.book_id } };
        const book = await Book.findOne(loanedBook);
        loans[i].dataValues.book_title = book.dataValues.title;

        const loaningPatron = {
          attributes: ['first_name', 'last_name'],
          where: { id: loans[i].dataValues.patron_id }
        };
        const patrons = await Patron.findOne(loaningPatron);
        const name = `${patrons.dataValues.first_name} ${patrons.dataValues.last_name}`;
        loans[i].dataValues.patron_name = name;
      }
      return loans;
    } catch (err) { throw err }
  }

  // Return options object to query for overdue loans
  Loan.isOverdue = Op => ({
    [Op.and]: [
      { return_by: { [Op.lt]: Date.now() }},
      { returned_on: { [Op.eq]: null }}
    ]
  })

  return Loan;
};
