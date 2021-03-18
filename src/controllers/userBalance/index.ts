import express from 'express'
import { validateIdParam } from '../../common/commonValidation'
import {
  getBalance,
  manageBitcoinBalance,
  manageUSDBalance,
} from './controller'
import { validateCoinAction, validateUSDAction } from './validation'

const userBalanceController = express.Router()

userBalanceController.get(
  '/users/:userId/balance',
  validateIdParam('userId'),
  getBalance,
)

userBalanceController.post(
  '/users/:userId/usd',
  validateIdParam('userId'),
  validateUSDAction,
  manageUSDBalance,
)

userBalanceController.post(
  '/users/:userId/bitcoins',
  validateIdParam('userId'),
  validateCoinAction,
  manageBitcoinBalance,
)

export default userBalanceController
