const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const { errors } = require('celebrate');

const app = express();

app.use(morgan());

app.get('/', (request, response) =>
  response.status(200).json({
    message: 'Auto deploy worked!',
  })
);

app.use(express.json());
app.use(routes);
app.use(errors());

module.exports = app;
