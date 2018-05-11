const Sequelize = require('sequelize');
const db = require('./database');

const Room = db.define('room', {
  rooms: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
});

module.exports = Room;
