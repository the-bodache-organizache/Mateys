const Sequelize = require('sequelize');
const db = require('./database');

const Widget = db.define('widget', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  commandText: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Widget;
