import expressWinston from 'express-winston'
import { getCorrelationId } from '../services/contextService'
import loggerService from '../services/loggerService'

expressWinston.requestWhitelist = [
  'httpVersion',
  'method',
  'url',
  'originalUrl',
  'query',
  'params',
  'body',
]

expressWinston.bodyBlacklist = ['password']

const requestLogger = expressWinston.logger({
  meta: true,
  winstonInstance: loggerService,
  dynamicMeta: () => {
    return { correlationId: getCorrelationId() }
  },
})

export default requestLogger
