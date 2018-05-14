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
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: '/widget-images/cody.png'
  }
});

module.exports = Widget;
