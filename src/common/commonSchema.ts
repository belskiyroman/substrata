import Joi from 'joi'

export default {
  isoDate: Joi.date().iso(),
  price: Joi.number().positive().allow(0),
  id: Joi.string().uuid({
    version: ['uuidv4'],
  }),
  email: Joi.string().trim().email(),
  name: Joi.string().trim().min(2),
  username: Joi.string()
    .trim()
    .min(2)
    .pattern(/^[A-Za-z0-9\-_]+?$/)
    .message('The username can contain next symbols: A-Z, a-z, 0-9, "-", "_"'),
}
