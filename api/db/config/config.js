const logger = require('../../utils/loggerFactory').createLogger('database');
module.exports = {
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
  },
  define: {
    underscored: true
  }
};