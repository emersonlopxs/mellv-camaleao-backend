const { celebrate, Segments, Joi} = require('celebrate')
const generateName = require('../utils/generateDisplayName')

module.exports =  celebrate({
  [Segments.BODY]:Joi.object().keys({
    displayname: Joi.string().default(generateName),
    name: Joi.string().required(),
    surname: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string(),  
    password: Joi.string().required(),
  })
})