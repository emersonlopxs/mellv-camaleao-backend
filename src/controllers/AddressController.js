const connection = require('../../database/connection')

module.exports = {
  async show(req, res){
    const cli_id = req.cli_id
    const id = req.params.id
    try{
      const address = await connection('address').select([
        'id',
        'street',
        'district',
        'number',
        'complement',
        'cep'
      ]).where('id', id).andWhere('cli_id', cli_id).andWhere('visible', 'true').first()

      if( address === undefined){
        return res.json({
          message: 'Não foi possível carregar endereço',
          status: 'this address is not visible'
        })
      }
      return res.json(address)
    }
    catch(err){
      return res.status(503).json({
        message: 'Não foi possível carregar endereço',
        status: 'could not select in database',
        err
      })
    }
  },

  async index(req, res) {
    const cli_id = req.cli_id
    try {
      const table = await connection('address').select([
        'id',
        'street',
        'district',
        'number',
        'complement',
        'cep',
        'visible'
      ]).where('cli_id', cli_id)

      const address = []
      table.forEach(e => {
        if (e.visible) {
          address.push({
            id: e.id,
            street: e.street,
            district: e.district,
            number: e.number,
            complement: e.complement,
            cep: e.cep,
          })
        }
      })
      return res.json(address)
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível carregar endereços',
        status: 'could not select in database',
        err
      })
    }
  },

  async create(req, res) {
    const cli_id = req.cli_id
    const { street, district, number, complement, cep } = req.body
    try {
      await connection('address').insert({
        cli_id,
        street,
        district,
        number,
        complement,
        cep
      })
      return res.status(201).send()
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not create instance in database',
        err
      })
    }
  },
  async delete(req, res) {
    const id = req.params.address_id
    const cli_id = req.cli_id
    try {
      const [validation] = await connection('address').select('visible').where('id', id).andWhere('cli_id', cli_id)
      if (validation.visible) {
        await connection('address').update({ visible: false }).where('id', id)
      }
      return res.status(204).send()
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not delete a intance in database',
        err
      })
    }
  },
  async update(req, res) {
    const id = req.params.address_id
    const cli_id = req.cli_id
    const { street, district, number, complement, cep } = req.body /* equanto ainda n tem jwt */
    try {
      const [address] = await connection('address').returning([
        'street',
        'district',
        'number',
        'complement',
        'cep'
      ]).where('id', id).andWhere('cli_id', cli_id).update({
        street,
        district,
        number,
        complement,
        cep
      })
      return res.json(address)
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'could not update a instance in database',
        err
      })
    }

  }
}