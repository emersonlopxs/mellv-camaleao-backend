const connection = require('../../database/connection');

module.exports = {
  async index(req, res) {
    const prod_id = parseInt(req.params.prod_id);
    try {
      const rating = await connection('rating')
        .select([
          'clients.name',
          'clients.displayname',
          'rating.id',
          'rating.stars',
          'rating.description',
          'rating.created_at',
          'rating.updated_at',
        ])
        .join('clients', 'rating.cli_id', 'clients.id')
        .where('prod_id', prod_id);
      return res.json(rating);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível exibir comentários',
        status: 'It was not possible to load the evaluations of these products',
        err,
      });
    }
  },
  async create(req, res) {
    console.log('create rating!');
    const cli_id = req.cli_id;
    const prod_id = parseInt(req.params.prod_id);
    const { stars, description } = req.body;

    try {
      await connection('rating').insert({
        cli_id,
        prod_id,
        stars,
        description,
      });
      return res.status(201).send();
    } catch (err) {
      console.log('error -> ', err);
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'It was not possible to create this evaluations',
        err,
      });
    }
  },
  async delete(req, res) {
    const cli_id = req.cli_id;
    const id = parseInt(req.params.rat_id);
    try {
      await connection('rating')
        .where('id', id)
        .andWhere('cli_id', cli_id)
        .del();
      return res.status(204).send();
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível deletar comentário',
        status: 'It was not possible delete this evaluation',
        err,
      });
    }
  },

  async update(req, res) {
    const cli_id = req.cli_id;
    const id = req.params.rat_id;
    const { stars, description } = req.body;

    try {
      const [rating] = await connection('rating')
        .returning(['stars', 'description'])
        .update({ stars, description })
        .where('id', id)
        .andWhere('cli_id', cli_id);
      return res.json(rating);
    } catch (err) {
      return res.status(503).json({
        message: 'Não foi possível alterar comentário',
        status: 'It was not possible update this evaluation',
        err,
      });
    }
  },
};
