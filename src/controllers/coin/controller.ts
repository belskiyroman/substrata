import { RequestHandler } from 'express'
import { DateTime } from 'luxon'
import { httpAssert } from '../../common/utils'
import CrudService from '../../services/crudService'
import { getExchangeRate } from '../../services/currencyService'
import { RequestHandlerFactory } from '../../types/common'
import { ExchangeRate } from '../../types/entities'

const Coin = new CrudService('exchangeRates')

export const getCoin: RequestHandlerFactory = (
  coinName: string,
): RequestHandler => async (req, res, next) => {
  try {
    const currentExchangeRate: ExchangeRate = await getExchangeRate(coinName)
    res.send(currentExchangeRate)
  } catch (e) {
    next(e)
  }
}

export const updateCoin: RequestHandlerFactory = (
  coinName: string,
): RequestHandler => async (req, res, next) => {
  try {
    const { price, updatedAt }: Partial<ExchangeRate> = req.body
    const currentExchangeRate: ExchangeRate = await getExchangeRate(coinName)
    const timestamp = new Date(updatedAt).toISOString()
    const currentUpdateTime = DateTime.fromISO(timestamp).toUTC().valueOf()
    const lastUpdateTime = DateTime.fromISO(currentExchangeRate.updatedAt)
      .toUTC()
      .valueOf()

    httpAssert(
      lastUpdateTime < currentUpdateTime,
      422,
      'Your patch is outdated. Server has more fresh info.',
    )

    const updatedExchangeRate = await Coin.update<ExchangeRate>(
      {
        name: coinName,
      },
      {
        price,
        updatedAt,
      },
    )
    res.send(updatedExchangeRate)
  } catch (e) {
    next(e)
  }
}
