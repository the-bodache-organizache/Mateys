const Sequelize = require('sequelize');
const db = require('./database');

const Rooms = db.define('room', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  occupancy: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = Rooms;
