const express = require('express');
const cors = require('cors');

const routes = express.Router();

const products = require('./controllers/ProductsController');
const clients = require('./controllers/ClientsController');
const profile = require('./controllers/ProfileController');
const address = require('./controllers/AddressController');
const rating = require('./controllers/RatingController');
const admin = require('./controllers/AdminController');
const order = require('./controllers/OrderController');
const payments = require('./controllers/PaymentsController');
const contact = require('./controllers/ContactController');

const JWT = require('./middlewares/auth');

/* validations */

const clientValidadion = require('./validation/clientValidation');
const loginValidadion = require('./validation/loginValidadion');

routes.use(
  cors({
    exposedHeaders: ['x-access-token'],
  })
);

/* basic routes for products */
routes.get('/products', products.index);
routes.get('/products/:id', products.show);
routes.post('/products/create', products.create);
routes.delete('/products/delete/:prod_id', products.delete);
routes.put('/products/update/:prod_id', products.update);

/* basic routes for clients */
routes.get('/clients', clients.index);
routes.get('/clients/profile', JWT.verifyJWT, profile.show); /* profile */
routes.post('/clients/signUp', clientValidadion, clients.create);
routes.post('/clients/logIn', loginValidadion, profile.create); /* login */
routes.delete('/clients/delete', clients.delete); /* has verification */
routes.put('/clients/update', clients.update); /* has verification */

/* basic routes for address */
routes.get('/address', JWT.verifyJWT, address.index);
routes.get('/address/:id', JWT.verifyJWT, address.show);
routes.post('/address/create', JWT.verifyJWT, address.create);
routes.delete('/address/delete/:address_id', JWT.verifyJWT, address.delete);
routes.put('/address/update/:address_id', JWT.verifyJWT, address.update);

/* basic routes for rating */
routes.get('/rating/:prod_id', rating.index);
routes.post('/rating/create/:prod_id', JWT.verifyJWT, rating.create);
routes.delete('/rating/delete/:rat_id', JWT.verifyJWT, rating.delete);
routes.put('/rating/update/:rat_id', JWT.verifyJWT, rating.update);

/* Basic routes for adminstrator */
routes.get('/dev/admin', admin.index); /* development route */
routes.post('/dev/admin/create', admin.create); /* development route */
routes.delete('/dev/admin/delete', admin.delete); /* development route */
routes.put('/admin/update', admin.update);

/* routes for order */
// should be an admin token to get all orders
routes.get('/orders', order.all);
routes.get('/order', JWT.verifyJWT, order.index);
routes.post('/order/create', JWT.verifyJWT, order.create);
routes.delete('/order/delete/:order_id', JWT.verifyJWT, order.delete);

routes.post('/payments', JWT.verifyJWT, payments.create);

routes.post('/contact', contact.create);

module.exports = routes;
