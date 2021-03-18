import { createTerminus } from '@godaddy/terminus'
import { AddressInfo } from 'net'
import app from './app'
import loggerService from './services/loggerService'

function onSigterm() {
  return Promise.all([
    // Close connection and so on, for example:
    // database.destroy(),
    // redis.disconnect(),
  ])
}

const healthCheck = async () => {
  return 'ok'
}

const server = app.listen(process.env.PORT, () => {
  const { port } = server.address() as AddressInfo
  loggerService.info(`API listening at port ${port}`)
})

createTerminus(server, {
  healthChecks: {
    '/_health': healthCheck,
  },
  timeout: 1000,
  onSigterm,
  logger: loggerService.error,
})

process.on('unhandledRejection', error => {
  loggerService.error('unhandledRejection', error)
  process.exit(1)
})
