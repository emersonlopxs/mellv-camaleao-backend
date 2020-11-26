const connection = require('../../database/connection')
const crypto = require('crypto')
const crypt = require('../utils/cryptPass')

module.exports = {
  async index(req, res) { /* development */
    try {
      const admin = await connection('admin').select('*')
      return res.json(admin)
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'it was could not to find administrators',
        err
      })
    }
  },
  async create(req, res) { /* development */
    const id = crypto.randomBytes(8).toString('HEX')
    const { email, pass, name } = req.body /* pass is a real password */
    try {
      const password = crypt.encrypt(pass)

      try {
        await connection('admin').insert({
          id,
          email,
          password,
          name
        })
        return res.status(201).send()
      }
      catch (err) {
        return res.status(503).json({
          message: 'Não foi possível processar sua requisição',
          status: 'It was not possible to create this administrator',
          err
        })
      }
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'It was not possible to encrypt the password ',
        err
      })
    }
  },
  async update(req, res) {
    const id = req.headers.admin_id
    const { email, pass, name } = req.body
    try {
      password = pass;
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'It was not possible to encrypt the password ',
        err
      })
    }
    try {
      const admin = await connection('admin').returning([
        'email',
        'name'
      ])
        .update({
          email,
          password,
          name
        })
        .where('id', id)

      return res.json(admin)
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'it was could not to update this administrator',
        err
      })
    }
  },

  async delete(req, res) { /* development */
    const id = req.headers.admin_id
    try {
      await connection('admin').where('id', id).del()
      return res.status(204).send()
    }
    catch (err) {
      return res.status(503).json({
        message: 'Não foi possível processar sua requisição',
        status: 'it was could not to delete this administrator'
      })
    }
  }
}