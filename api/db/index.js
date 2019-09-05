const logger = require('../utils/loggerFactory').createLogger(__filename);
const Sequelize = require('sequelize');

//Entities
// const Cart = require('./entities/cartModel')
// const Buyer = require('./entities/buyerModel')
// const CartItem = require('./entities/cartItemModel')

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'postgres',
  timezone: '-03:00',
  loggin: logger.info,
  pool: {
    max: Number(process.env.DB_POOL_MAX),
    min: Number(process.env.DB_POOL_MIN),
    idle: Number(process.env.DB_POOL_IDLE)
  }
};

class Db {
  constructor() {
    this.sequelize = new Sequelize(config);
    this.testConnection();
  }

  testConnection() {
    this.sequelize.authenticate().then(() => {
      logger.info('Connection has been established successfully');
    }).catch((err) => {
      logger.error('Unable to connect to the database: ', err);
    }); 
  }

  syncModels() {
    if (process.env.DB_SYNC_MODELS == 'true') {
      this.sequelize.sync();
    }
  }
}

const db = new Db();
module.exports = db;