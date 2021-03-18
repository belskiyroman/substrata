import { celebrate, Segments } from 'celebrate'
import Joi from 'joi'
import commonSchema from './commonSchema'
import { RequestHandlerFactory } from '../types/common'

export const validateIdParam: RequestHandlerFactory = (paramName: string) =>
  celebrate({
    [Segments.PARAMS]: Joi.object({
      [paramName]: commonSchema.id
        .required()
        .label('An "id" that you use is invalid.'),
    }).required(),
  })
