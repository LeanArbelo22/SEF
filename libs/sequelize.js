const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('../db/models');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;


const sequelize = new Sequelize(config.dbUrl, {
  dialect: 'postgres',
  logging: true,
  dialectOptions: {
    useUTC: false, // ?? for reading from database
  },
  timezone: '+03:00', // !! for writing to database
});

setupModels(sequelize);

module.exports = sequelize;

