import { Namespace } from 'cls-hooked'
import { RequestHandler } from 'express'
import { v4 } from 'uuid'
import { getOrCreateContext } from '../services/contextService'

export const correlationIdMiddleware = (
  correlationHeaderName?: string,
): RequestHandler => (req, res, next) => {
  const headerName: string = correlationHeaderName || 'X-Correlation-Id'
  const correlationId: string = req.get(headerName) || v4()
  const ctx: Namespace = getOrCreateContext()
  ctx.set('correlationId', correlationId)
  res.header(headerName, correlationId)
  next()
}

export const contextMiddleware: RequestHandler = (req, res, next) => {
  const ctx: Namespace = getOrCreateContext()
  ctx.bindEmitter(req)
  ctx.bindEmitter(res)
  ctx.run(() => next())
}
