import { ValueObject } from './common'

declare namespace entity {
  type DBRecordFields = ValueObject<number | string | boolean>

  interface BaseEntity {
    id: string
    createdAt: string
    updatedAt: string
  }

  type Entity = BaseEntity & DBRecordFields

  interface NewUser {
    email: string
    username: string
    name: string
    bitcoinAmount: number
    usdBalance: number
  }

  interface User extends BaseEntity, NewUser {}

  interface ExchangeRate extends BaseEntity {
    name: string
    price: number
  }
}

export = entity
