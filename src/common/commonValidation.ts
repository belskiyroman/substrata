import { celebrate, Segments } from 'celebrate'
import Joi from 'joi'
import { RequestHandlerFactory } from '../types/common'
import commonSchema from './commonSchema'

export const validateIdParam: RequestHandlerFactory = (paramName: string) =>
  celebrate({
    [Segments.PARAMS]: Joi.object({
      [paramName]: commonSchema.id
        .required()
        .label('An "id" that you use is invalid.'),
    }).required(),
  })
