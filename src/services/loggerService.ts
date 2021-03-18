import { Format, FormatWrap } from 'logform'
import * as util from 'util'
import * as winston from 'winston'
import { getCorrelationId } from './contextService'

const { format, createLogger, transports } = winston

const addCorrelationId: FormatWrap = format(info => {
  const correlationId = getCorrelationId()

  if (!correlationId) return info
  if (info.meta?.correlationId) return info
  if (info.level !== 'error') {
    info.meta = info.meta || {}
    info.meta.correlationId = getCorrelationId()
    return info
  }

  // add correlationId to an error object
  if (info.correlationId) return info
  return Object.assign(info, {
    correlationId: getCorrelationId(),
  })
})

const CLI_FORMAT: Format = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  addCorrelationId(),
  format.errors({ stack: true }),
  format.printf(info => {
    const { timestamp, service, level, meta = {}, message, stack } = info
    const baseInfo = `${timestamp} [${service}] ${level}:`
    const messageInfo = message && message.trim()
    const statusCode = meta && meta.res && meta.res.statusCode
    const statusCodeInfo =
      statusCode && util.inspect(statusCode, { colors: true })
    const metaInfo = util.inspect(meta, {
      breakLength: Infinity,
      sorted: true,
      colors: true,
    })
    const baseMessage = [baseInfo, statusCodeInfo, messageInfo]
      .filter(Boolean)
      .join(' ')

    return [baseMessage, metaInfo, stack].filter(Boolean).join('\n')
  }),
)

const STANDARD_FORMAT: Format = format.combine(
  format.splat(),
  addCorrelationId(),
  format.errors({ stack: true }),
  format.json(),
)

const getTransports = () => {
  const isProdTransports = ['production'].includes(process.env.NODE_ENV)
  const _transports = [new transports.Console()]

  if (isProdTransports) {
    // transports that using in prod env (eg. Sentry)
    // _transports.push()
  }

  return _transports
}

const loggerService = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.LOG_FORMAT === 'CLI' ? CLI_FORMAT : STANDARD_FORMAT,
  transports: process.env.LOG_LEVEL === 'disabled' ? [] : getTransports(),
  defaultMeta: { service: 'api' },
})

export default loggerService
