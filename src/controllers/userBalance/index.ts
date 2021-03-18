import express from 'express'
import { validateIdParam } from '../../common/commonValidation'
import { validateUSDAction, validateCoinAction } from './validation'
import {
  manageUSDBalance,
  manageBitcoinBalance,
  getBalance,
} from './controller'

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
