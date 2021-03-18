import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express, { RequestHandler } from 'express'
import helmet from 'helmet'
import apiV1 from './api/apiV1'
import db from './common/db'
import {
  handleInternalErrors,
  handleNotFound,
} from './controllers/error/controller'
import requestLogger from './middlewares/requestLogger'
import {
  contextMiddleware,
  correlationIdMiddleware,
} from './middlewares/context'

// Special endpoint for the test task that shows the DB.
const showDB: RequestHandler = (req, res) => res.json(db)
const welcome: RequestHandler = (req, res) => res.send('Substrata API.')

const app = express()

app.use(helmet())
app.use(cors())
app.use(compression())
app.use(bodyParser.json())

app.use(contextMiddleware)
app.use(correlationIdMiddleware())
app.use(requestLogger)

if (process.env.NODE_ENV === 'development') {
  app.get('/db', showDB)
}

app.get('/', welcome)
app.use('/v1', apiV1)

app.use(handleNotFound)
app.use(handleInternalErrors)

export default app
