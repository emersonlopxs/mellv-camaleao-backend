const knex = require('knex');

const knexfile = require('../knexfile');

const env = 'development'; /* put the global variable */
const configOptions = knexfile[env];

module.exports = knex(configOptions);
