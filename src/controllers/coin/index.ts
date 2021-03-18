import express from 'express'
import { getCoin, updateCoin } from './controller'
import { validateUpdate } from './validation'

const coinController = express.Router()

coinController.get('/bitcoin', getCoin('bitcoin'))

coinController.put('/bitcoin', validateUpdate, updateCoin('bitcoin'))

export default coinController
