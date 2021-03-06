const connection = require('../../database/connection');
const createToken = require('../utils/createToken');
const crypt = require('../utils/cryptPass');
const SendEmail = require('../utils/sendMail');

module.exports = {
  async show(req, res) {
    const id = req.cli_id;
    try {
      console.log('id -> ', id, req);

      const client = await connection('clients')
        .select(['id', 'name', 'surname', 'displayname', 'email', 'phone'])
        .where('id', id);
      return res.json(client);
    } catch (err) {
      console.log('error -> ', err);
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not show client',
        err,
      });
    }
  },
  async create(req, res) {
    try {
      const { email, password } = req.body;
      console.log('\n\n\npassword -> ', email, password);
      // const password = crypt.encrypt(String(req.body.password));

      const clients = await connection('clients')
        .select('id')
        .where({ email, password })
        .first();

      if (!clients) {
        return res.status(503).json({
          message: 'Error ao logar',
        });
      }

      const token = createToken(clients.id);

      const { error } = await SendEmail({
        name: 'Emerson',
        to: email,
        message: `
        <p>
          Hey! Someone logged into your account! Mellv team.
        </p>
        `,
      });

      if (error) {
        res.status(502).send({
          error: 'Email error',
          message: 'Your email is not valid, but your account was created',
        });
      }

      return res.status(204).header('x-access-token', token).send();
    } catch (error) {
      console.log('error -> ', error);

      return res.status(503).json({
        message: 'Não foi possível logar, confira suas credenciais',
        status: 'could not log in',
        error,
      });
    }
  },
};
