import { httpAssert } from '../common/utils'
import { CurrencyValue } from '../types/common'
import { ExchangeRate, User } from '../types/entities'
import CrudService from './crudService'
import { exchange, getExchangeRate, sumOf } from './currencyService'
import loggerService from './loggerService'

const UserModel = new CrudService('users')

const isBalanceValid = (value: number) => {
  if (value < 0) return false
  if (isNaN(value)) return false
  if (Number.NEGATIVE_INFINITY === value) return false
  if (Number.POSITIVE_INFINITY === value) return false
  return true
}

const getUserCoins = async (user: User, coinName: string): Promise<number> => {
  // getter of user's coins by name
  return user.bitcoinAmount
}

const updateCoinsBalance = async (
  user: User,
  value: number,
  coinName: string,
): Promise<number> => {
  // setter of user's coins by name
  const [updatedUser]: User[] = await UserModel.update<User>(
    {
      id: user.id,
    },
    {
      bitcoinAmount: value,
    },
  )
  return updatedUser.bitcoinAmount
}

export const isUsernameFree = async (username: string): Promise<boolean> => {
  const [user]: User[] = await UserModel.find<User>({ username })
  return !user
}

export const isEmailFree = async (email: string): Promise<boolean> => {
  const [user]: User[] = await UserModel.find<User>({ email })
  return !user
}

export const userBalance = async (user: User): Promise<number> => {
  const bitcoin: ExchangeRate = await getExchangeRate('bitcoin')
  const { value: usd }: CurrencyValue = exchange(
    user.bitcoinAmount,
    bitcoin.price,
  )
  const balance: CurrencyValue = sumOf(user.usdBalance, usd)
  httpAssert(isBalanceValid(balance.value), 500, 'Internal Server Error.', () =>
    loggerService.error('Failed to calculate user balance.'),
  )
  return balance.rounded
}

export const deposit = async (user: User, value: number): Promise<void> => {
  const balance = user.usdBalance
  const newBalance = sumOf(balance, value)
  httpAssert(
    isBalanceValid(newBalance.value),
    500,
    'Internal Server Error.',
    () =>
      loggerService.error('Balance become invalid after updating.', {
        previousValue: balance,
        nextValue: newBalance.value,
        sumOfTransaction: value,
      }),
  )
  const [updatedUser]: User[] = await UserModel.update<User>(
    {
      id: user.id,
    },
    {
      usdBalance: newBalance.value,
    },
  )
  httpAssert(
    updatedUser.usdBalance === newBalance.value,
    500,
    'Internal Server Error.',
    () =>
      loggerService.error('Balance was updated incorrect.', {
        previousValue: balance,
        nextValue: newBalance.value,
        sumOfTransaction: value,
        currentValue: updatedUser.usdBalance,
      }),
  )
}

export const withdraw = async (user: User, value: number): Promise<void> => {
  const balance = user.usdBalance
  httpAssert(
    balance >= value,
    422,
    'Insufficient funds to complete the operation.',
  )
  const newBalance = sumOf(user.usdBalance, -value)
  httpAssert(
    isBalanceValid(newBalance.value),
    500,
    'Internal Server Error.',
    () =>
      loggerService.error('Balance become invalid after updating.', {
        previousValue: balance,
        currentValue: newBalance.value,
        sumOfTransaction: value,
      }),
  )
  const [updatedUser]: User[] = await UserModel.update<User>(
    {
      id: user.id,
    },
    {
      usdBalance: newBalance.value,
    },
  )
  httpAssert(
    updatedUser.usdBalance === newBalance.value,
    500,
    'Internal Server Error.',
    () =>
      loggerService.error('Balance was updated incorrect.', {
        previousValue: balance,
        nextValue: newBalance.value,
        sumOfTransaction: value,
        currentValue: updatedUser.usdBalance,
      }),
  )
}

export const buyCoins = async (
  user: User,
  value: number,
  coinName: string,
): Promise<void> => {
  const exchangeRate: ExchangeRate = await getExchangeRate(coinName)
  const price: CurrencyValue = exchange(value, exchangeRate.price)
  await withdraw(user, price.value)
  const oldCoinsBalance: number = await getUserCoins(user, coinName)
  const newCoinsBalance: CurrencyValue = sumOf(value, oldCoinsBalance)
  const currentCoinsBalance = await updateCoinsBalance(
    user,
    newCoinsBalance.value,
    'bitcoin',
  )
  httpAssert(
    currentCoinsBalance === newCoinsBalance.value,
    500,
    'Internal Server Error.',
    () =>
      loggerService.error('Coins balance was updated incorrect.', {
        previousValue: oldCoinsBalance,
        nextValue: newCoinsBalance.value,
        sumOfTransaction: value,
        currentValue: currentCoinsBalance,
      }),
  )
}

export const sellCoins = async (
  user: User,
  value: number,
  coinName: string,
): Promise<void> => {
  const coins: number = await getUserCoins(user, coinName)
  httpAssert(
    coins >= value,
    422,
    'Insufficient funds to complete the operation.',
  )
  const exchangeRate: ExchangeRate = await getExchangeRate(coinName)
  const price: CurrencyValue = exchange(value, exchangeRate.price)
  const newCoinsBalance: CurrencyValue = sumOf(coins, -value)
  httpAssert(
    isBalanceValid(newCoinsBalance.value),
    500,
    'Internal Server Error.',
  )
  await deposit(user, price.value)
  const currentCoinsBalance: number = await updateCoinsBalance(
    user,
    newCoinsBalance.value,
    'bitcoin',
  )
  httpAssert(
    currentCoinsBalance === newCoinsBalance.value,
    500,
    'Internal Server Error.',
    () =>
      loggerService.error('Coins balance was updated incorrect.', {
        previousValue: coins,
        nextValue: newCoinsBalance.value,
        sumOfTransaction: value,
        currentValue: currentCoinsBalance,
      }),
  )
}
