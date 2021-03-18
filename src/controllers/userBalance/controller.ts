import { RequestHandler } from 'express'
import { httpAssert } from '../../common/utils'
import CrudService from '../../services/crudService'
import * as userService from '../../services/userService'
import { User } from '../../types/entities'

const UserModel = new CrudService('users')

export const getBalance: RequestHandler = async (req, res, next) => {
  try {
    const user: User = await UserModel.get<User>(req.params.userId)
    httpAssert(user, 404, 'User not found.')
    const balance: number = await userService.userBalance(user)
    res.send({
      balance,
    })
  } catch (e) {
    next(e)
  }
}

export const manageUSDBalance: RequestHandler = async (req, res, next) => {
  try {
    const { action, amount } = req.body
    const user: User = await UserModel.get<User>(req.params.userId)
    httpAssert(user, 404, 'User not found.')

    switch (action) {
    case 'deposit':
      await userService.deposit(user, amount)
      break
    case 'withdraw':
      await userService.withdraw(user, amount)
      break
    }

    const updatedUser: User = await UserModel.get<User>(req.params.userId)
    res.send(updatedUser)
  } catch (e) {
    next(e)
  }
}

export const manageBitcoinBalance: RequestHandler = async (req, res, next) => {
  try {
    const { action, amount } = req.body
    const user: User = await UserModel.get<User>(req.params.userId)
    httpAssert(user, 404, 'User not found.')

    switch (action) {
    case 'buy':
      await userService.buyCoins(user, amount, 'bitcoin')
      break
    case 'sell':
      await userService.sellCoins(user, amount, 'bitcoin')
      break
    }

    const updatedUser: User = await UserModel.get<User>(req.params.userId)
    res.send(updatedUser)
  } catch (e) {
    next(e)
  }
}
