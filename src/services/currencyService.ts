import { httpAssert } from '../common/utils'
import { CurrencyValue } from '../types/common'
import * as bigdecimal from 'bigdecimal'
import { ExchangeRate } from '../types/entities'
import CrudService from './crudService'
import loggerService from './loggerService'

const BigDecimal = bigdecimal.BigDecimal
const Coin = new CrudService('exchangeRates')

export const round = (value: number): number => parseFloat(value.toFixed(2))

export const exchange = (
  value: number,
  exchangeRate: number,
): CurrencyValue => {
  const num = new BigDecimal(value.toString())
  const rate = new BigDecimal(exchangeRate.toString())
  const price: number = num.multiply(rate).floatValue()
  return {
    value: price,
    rounded: round(price),
  }
}

export const sumOf = (...values: number[] | string[]): CurrencyValue => {
  const sum = values
    // @ts-ignore
    .reduce(
      (sum, item: number | string) => sum.add(new BigDecimal(item.toString())),
      new BigDecimal(0),
    )
    .floatValue()
  return {
    value: sum,
    rounded: round(sum),
  }
}

export const getExchangeRate = async (
  coinName: string,
): Promise<ExchangeRate> => {
  const [exchangeRate]: ExchangeRate[] = await Coin.find<ExchangeRate>({
    name: coinName,
  })
  httpAssert(exchangeRate, 502, `No data for the ${coinName}.`, () =>
    loggerService.error(`There is no exchange rate for the ${coinName}.`),
  )
  return exchangeRate
}
