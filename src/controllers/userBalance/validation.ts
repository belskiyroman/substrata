import { celebrate, Segments } from 'celebrate'
import { RequestHandler } from 'express'
import Joi from 'joi'
import commonSchema from '../../common/commonSchema'

export const validateUSDAction: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object({
    action: Joi.string().valid('withdraw', 'deposit').required(),
    amount: commonSchema.price.required(),
  }).required(),
})

export const validateCoinAction: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object({
    action: Joi.string().valid('buy', 'sell').required(),
    amount: commonSchema.price.required(),
  }).required(),
})
