'use strict';
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * Sequelize File
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
const fs = require('fs');
const path = require('path');
let Sequelize = require('sequelize');
require('dotenv').config();
const basename = path.basename(__filename);
const { DataTypes } = require('sequelize');
const config = {
  DB_DATABASE: process.env.DB_DATABASE,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_ADAPTER: process.env.DB_ADAPTER,
  DB_NAME: process.env.DB_NAME,
  DB_HOSTNAME: process.env.DB_HOSTNAME,
  DB_PORT: process.env.DB_PORT,
};

let db = {};

let sequelize = new Sequelize(config.DB_DATABASE, config.DB_USERNAME, config.DB_PASSWORD, {
  dialect: config.DB_ADAPTER,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  host: config.DB_HOSTNAME,
  port: config.DB_PORT,
  logging: console.log,
  timezone: '-04:00',
  pool: {
    maxConnections: 1,
    minConnections: 0,
    maxIdleTime: 100,
  },
  define: {
    timestamps: false,
    underscoredAll: true,
    underscored: true,
  },
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
// sequelize.sync({ force: true });

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    var model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;