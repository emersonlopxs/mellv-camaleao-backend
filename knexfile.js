require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://ftbhthvl:4URObjVYYloQXODI_ksJOU4RTLnYeVXk@tuffi.db.elephantsql.com:5432/ftbhthvl',
    migrations: {
      directory: path.join(__dirname, '/database/migrations')
    },
  },

  testing: {
    client: 'pg',
    connection: process.env.DB_URL_TEST,
    migrations: {
      directory: './database/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: 'postgres://ftbhthvl:4URObjVYYloQXODI_ksJOU4RTLnYeVXk@tuffi.db.elephantsql.com:5432/ftbhthvl',
    migrations: {
      directory: './database/migrations',
    },
  },

};
