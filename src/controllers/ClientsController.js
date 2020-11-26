const connection = require('../../database/connection');
const crypto = require('crypto');
const crypt = require('../utils/cryptPass');
const createToken = require('../utils/createToken');
module.exports = {
  async index(req, res) {
    try {
      const clients = await connection('clients').select([
        'id',
        'name',
        'surname',
        'displayname',
        'email',
        'phone',
        'ban',
      ]);
      return res.json(clients);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível carregar clientes',
        status: 'could not select in database',
        err,
      });
    }
  },
  async create(req, res) {
    try {
      const id = crypto.randomBytes(8).toString('HEX');
      const token = createToken(id);

      const { name, surname, displayname, email, phone } = req.body;
      /* cripting password */
      const password = crypt.encrypt(req.body.password);
      
      await connection('clients').insert({
        id,
        name,
        surname,
        displayname,
        email,
        password,
        phone,
      });
      return res.status(201).header('x-access-token', token).send();
    } catch (err) {
      console.log(err);

      return res.status(503).json({
        message: 'Falha ao criar usuario',
        status: 'could not create instance in database',
        err,
      });
    }
  },
  async delete(req, res) {
    const id = req.headers.cli_id;
    try {
      const [validation] = await connection('clients')
        .select('ban')
        .where('id', id);

      if (validation.ban === false) {
        await connection('clients').update({ ban: true }).where('id', id);
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
    const id = req.headers.cli_id;
    /* build new password, and new email, and e-mail verify */
    const { name, surname, displayname, email, phone } = req.body;
    try {
      const products = await connection('clients')
        .returning(['name', 'surname', 'displayname', 'email', 'phone'])
        .where('id', id)
        .update({
          name,
          surname,
          displayname,
          email,
          phone,
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
