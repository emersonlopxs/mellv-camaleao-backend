const connection = require('../../database/connection');
const SendEmail = require('../utils/sendMail');
const stripe = require('stripe')(
  'sk_test_51HhP5gBjxpHUqipJfDaPuvm64NNvn1ruWB8ASB1rUofL2aqKmN0IHYcqNicnm3YjcyKKR1yxKFGIEkVX59Eit9HS006fZaKZz3'
);

module.exports = {
  async all(req, res) {
    let same = [],
      order,
      order_det;
    try {
      order = await connection('order')
        .join('address', 'order.address_id', 'address.id')
        .select([
          'address.street',
          'address.district',
          'address.number',
          'address.complement',
          'order.id',
          'order.cupon_id',
          'order.total_price',
          'order.status',
          'order.note',
          'order.created_at',
          'order.name',
          'order.cpf',
        ]);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not select order instance in database',
        err,
      });
    }

    const id = order.map((e) => e.id);

    try {
      order_det = await connection('order_det')
        .select('*')
        .whereIn('order_id', id);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not select order details instance in database',
        err,
      });
    }
    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order_det.length; j++) {
        if (order[i].id === order_det[j].order_id) {
          same.push({
            product_id: order_det[j].product_id,
            amount: order_det[j].amount,
          });
        }
      }
      order[i].details = same;
      same = [];
    }
    return res.json(order);
  },

  async index(req, res) {
    const cli_id = req.cli_id;
    const test = [];
    let same = [],
      order,
      order_det;
    try {
      order = await connection('order')
        .join('address', 'order.address_id', 'address.id')
        .select([
          'address.street',
          'address.district',
          'address.number',
          'address.complement',
          'order.id',
          'order.cupon_id',
          'order.total_price',
          'order.status',
          'order.note',
        ])
        .where('order.cli_id', cli_id);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not select order instance in database',
        err,
      });
    }

    const id = order.map((e) => e.id);
    console.log('id -> ', id);

    try {
      order_det = await connection('order_det')
        .select('*')
        .whereIn('order_id', id);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not select order details instance in database',
        err,
      });
    }

    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < order_det.length; j++) {
        if (order[i].id === order_det[j].order_id) {

          const [product] = await connection('products')
            .select(['name', 'id', 'images'])
            .where('id', order_det[j].product_id);

          same.push({
            amount: order_det[j].amount,
            size: order_det[j].size,
            product,
          });
        }
      }

      order[i].details = same;

      // console.log('\n\norder -> ', order[i].details);
      // const newDetails = order[i].details.map(async (item) => {
      // const [product] = await connection('products')
      //   .select(['name', 'id', 'images'])
      //   .where('id', item.product_id);

      //   console.log('\n\nproduct -> ', product);

      //   return {
      //     ...order[i].details,
      //     product,
      //   };
      // });

      same = [];

      // const bar = await newDetails;

      // console.log('\n\n newdetails -> ', bar);
    }

    return res.json(order);
  },

  async create(req, res) {
    const cli_id = req.cli_id;
    const {
      cart,
      total,
      address_id,
      note,
      stripe_pay_id,
      name,
      cpf,
    } = req.body;

    try {
      const [id] = await connection('order')
        .insert({
          cli_id,
          address_id,
          total_price: total,
          note,
          name,
          cpf,
        })
        .returning('id');

      const details = cart.map((item) => ({
        product_id: item.productId,
        order_id: id,
        amount: item.amount,
        size: item.size,
      }));

      details.forEach(async (item) => {
        const [product] = await connection('products')
          .select(['id', 'sizes'])
          .where('id', item.product_id);

        const sizes = JSON.parse(product.sizes);

        const newSizes = {
          ...sizes,
          [item.size]: String(
            Number(sizes[item['size']]) - Number(item.amount)
          ),
        };

        const [updatedProduc] = await connection('products')
          .returning('*')
          .where('id', item.product_id)
          .update({
            sizes: [JSON.stringify(newSizes)],
          });
      });

      const [order_det] = await connection('order_det')
        .insert(details)
        .returning('*');

      const payment = await stripe.paymentIntents.create({
        amount: Number(total) * 100,
        currency: 'BRL',
        description: 'Descrição...',
        payment_method: stripe_pay_id,
        confirm: true,
        metadata: {
          customer_id: cli_id,
          order_id: id,
        },
      });

      const { id: payment_id, amount_received, description } = payment;

      console.log('stripe-routes.js 19 | payment', amount_received, payment_id),
        description;

      await connection('order_payments').insert({
        cli_id,
        order_id: id,
        stripe_pi_id: payment_id,
      });

      // const { error } = await SendEmail({
      //   name: 'User',
      //   to: email,
      //   message: `
      //   <div>
      //     <p>
      //       Recebemos o seu pedido.
      //     </p>
      //     <p>
      //       Valor: ${amount_received}
      //     </p>
      //     <p>
      //       Nota: ${note}
      //     </p>
      //     <p>
      //       Nome e CPF: ${name}, ${cpf}
      //     </p>

      //     <p>Camaleao</p>
      //   </div>
      //   `,
      // });

      // if (error) {
      //   res.status(502).send({
      //     error: 'Email error',
      //     message: 'Your email is not valid, but your account was created',
      //   });
      // }

      return res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log('error -> ', error);
      return res.status(500).json({ error: error });
    }
  },
  async delete(req, res) {
    const cli_id = req.cli_id;
    const id = req.params.order_id;
    try {
      await connection('order').where({ cli_id, id }).del();
      return res.status(204).send();
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not delete order in database',
        err,
      });
    }
  },
};
