'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {type: Sequelize.STRING,
      validate: {
        notEmpty: {msg: '"Title" is required'}
      }
    },
    author: {type: Sequelize.STRING,
        validate: {
            notEmpty: {msg:'"Author" is required'}
        }
    },
    genre: {type: Sequelize.STRING},
    year: {type: Sequelize.INTEGER},
  }, { sequelize });

  return Book;
};

//Testing the connection with the database. 
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection with database correct');
  } catch (error) {
    console.error('Connection with database error', error);
  }
})();