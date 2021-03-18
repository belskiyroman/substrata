import { celebrate, Segments } from 'celebrate'
import { RequestHandler } from 'express'
import Joi from 'joi'
import commonSchema from '../../common/commonSchema'

export const validateCreateUser: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object({
    name: commonSchema.name,
    username: commonSchema.username,
    email: commonSchema.email,
  }).required(),
})

export const validateUpdateUser: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object({
    name: commonSchema.name,
    username: commonSchema.username,
    email: commonSchema.email,
    id: commonSchema.id.optional(),
    usdBalance: commonSchema.price.optional(),
    bitcoinAmount: commonSchema.price.optional(),
    createdAt: commonSchema.isoDate.optional(),
    updatedAt: commonSchema.isoDate.optional(),
  }).required(),
})
