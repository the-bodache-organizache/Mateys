const Sequelize = require('sequelize');
const pkg = require('../../package.json');
const defaultDatabaseUrl = `postgres://localhost/${pkg.name}`;

let dbName = process.env.DATABASE_URL || defaultDatabaseUrl;
if (process.env.NODE_ENV === 'test') {
  dbName += '-test';
}

const db = new Sequelize(dbName, {
  logging: false
});

module.exports = db;
