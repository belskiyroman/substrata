import { errors } from 'celebrate'
import { ErrorRequestHandler, RequestHandler } from 'express'
import httpError from 'http-errors'
import loggerService from '../../services/loggerService'

const formatMessage = error => {
  const { message, statusCode, name } = error
  if (typeof message !== 'string') return message

  return {
    error: name,
    statusCode,
    message,
  }
}

export const handleValidationErrors: ErrorRequestHandler = errors()

export const handleNotFound: RequestHandler = (req, res, next) => {
  next(new httpError.NotImplemented())
}

export const handleHttpError: ErrorRequestHandler = (err, req, res, next) => {
  if (!(err instanceof httpError.HttpError)) return next(err)
  const formattedMessage = formatMessage(err)
  return res.status(err.statusCode).json(formattedMessage)
}

export const handleInternalErrors: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  loggerService.error(err)
  handleHttpError(err, req, res, next)
}
