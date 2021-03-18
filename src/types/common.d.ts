/*
 * Here should be common types that can be used in this application.
 * */
import { RequestHandler } from 'express'

declare namespace commonTypes {
  type ValueObject<V = string> = { [key: string]: V }

  type RequestHandlerFactory = (...rest: any[]) => RequestHandler

  type CurrencyValue = {
    value: number
    rounded: number
  }
}

export = commonTypes
