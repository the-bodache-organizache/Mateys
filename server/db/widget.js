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
  command: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  ready: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

module.exports = Widget;
