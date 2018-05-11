const Sequelize = require('sequelize');
const db = require('./database');

const Rooms = db.define('room', {
  name: {
    type: Sequelize.STRING
  }
});

module.exports = Rooms;
