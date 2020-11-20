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
    const { name, type, price, sizes, description, images } = req.body;

    console.log('body -> ', req.body);
    try {
      await connection('products').insert({
        name,
        type,
        price,
        sizes,
        description,
        images,
      });
      return res.status(201).send();
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not create instance in database',
        err,
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
    const { name, type, price, sizes, description, images } = req.body;
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
        ])
        .where('id', id)
        .update({
          name,
          type,
          price,
          sizes,
          description,
          images,
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
