import { celebrate, Segments } from 'celebrate'
import { RequestHandler } from 'express'
import Joi from 'joi'
import commonSchema from '../../common/commonSchema'

export const validateUpdate: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object({
    price: commonSchema.price.required(),
    updatedAt: commonSchema.isoDate.max('now').required(),
  }).required(),
})
