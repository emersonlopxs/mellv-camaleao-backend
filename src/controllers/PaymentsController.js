const stripe = require('stripe')(
  'sk_test_51HhP5gBjxpHUqipJfDaPuvm64NNvn1ruWB8ASB1rUofL2aqKmN0IHYcqNicnm3YjcyKKR1yxKFGIEkVX59Eit9HS006fZaKZz3'
);

const connection = require('../../database/connection');

module.exports = {
  async show(req, res) {
    const id = req.params.id;
    try {
      const product = await connection('products')
        .select([
          'id',
          'name',
          'type',
          'price',
          'sizes',
          'description',
          'images',
          'amount',
        ])
        .where('id', id)
        .andWhere('visible', 'true');

      if (product.length === 0) {
        return res.json({
          message: 'Não foi possível carregar o produto',
          status: 'Is a not visible product',
        });
      }
      return res.json(product);
    } catch (err) {
      return res.json({
        message: 'Não foi possível carregar o produto',
        status: 'could not select in database',
        err,
      });
    }
  },

  async index(req, res) {
    try {
      console.log('get products');
      console.log('connection -> ', connection.client.connectionSettings);
      let table = await connection('products').select([
        'id',
        'name',
        'type',
        'price',
        'sizes',
        'description',
        'images',
        'amount',
        'visible',
      ]);
      const products = [];
      table.forEach((e) => {
        if (e.visible) {
          products.push({
            id: e.id,
            name: e.name,
            type: e.type,
            price: e.price,
            sizes: e.sizes,
            description: e.description,
            images: e.images,
            amount: e.amount,
          });
        }
      });
      return res.json(products);
    } catch (err) {
      console.log('error -> ', err);
      return res.status(503).json({
        message: 'Não foi possível carregar produtos',
        status: 'could not select in database',
        err,
      });
    }
  },
  async create(req, res) {
    //const admin_id = req.headers.authorization;
    const { cli_id } = req;
    const { order_id } = req.body;

    console.log('id -> ', cli_id);

    let { amount, id } = req.body;

    try {
      const payment = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'BRL',
        description: 'Descrição...',
        payment_method: id,
        confirm: true,
        metadata: {
          customer_id: cli_id,
          order_id: '1',
        },
      });

      const { id: payment_id, amount_received, description } = payment;

      console.log('stripe-routes.js 19 | payment', amount_received, payment_id),
        description;

      await connection('order_payments').insert({
        cli_id,
        order_id,
        stripe_pi_id: payment_id,
      })

      res.json({
        message: 'Payment Successful',
        success: true,
      });
    } catch (error) {
      console.log('stripe-routes.js 17 | error', error);
      res.json({
        message: 'Payment Failed',
        success: false,
      });
    }
  },
  async delete(req, res) {
    //const admin_id = req.headers.authorization;
    const id = req.params.prod_id;
    try {
      const [validation] = await connection('products')
        .select(['visible'])
        .where('id', id);
      if (validation.visible) {
        await connection('products').update({ visible: false }).where('id', id);
      }
      return res.status(204).send();
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not delete instance in database',
        err,
      });
    }
  },
  async update(req, res) {
    //const admin_id = req.headers.authorization;
    const id = req.params.prod_id;
    const { name, type, price, sizes, description, images, amount } = req.body;
    try {
      const [products] = await connection('products')
        .returning([
          'id',
          'name',
          'type',
          'price',
          'sizes',
          'description',
          'images',
          'amount',
        ])
        .where('id', id)
        .update({
          name,
          type,
          price,
          sizes,
          description,
          images,
          amount,
        });
      return res.json(products);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not update instance in database',
        err,
      });
    }
  },
};
