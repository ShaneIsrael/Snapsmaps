const logger = require('../../utils/logger')

require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    port: 5432,
    dialect: 'postgres',
    options: {
      timezone: 'utc',
      logging: (msg) => logger.debug(msg),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT || 5432,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        ca: process.env.PROD_DB_CA_CERT,
      },
    },
    options: {
      timezone: 'utc',
      logging: false,
      pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  },
}
