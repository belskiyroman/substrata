import _ from 'lodash'
import { DateTime } from 'luxon'
import { v4 } from 'uuid'
import db from '../common/db'
import { BaseEntity, DBRecordFields, Entity } from '../types/entities'

class CrudService {
  static async find<T = Entity>(
    collectionName: string,
    attrs: Partial<T>,
  ): Promise<T[]> {
    const res = _.filter(db[collectionName] ?? [], attrs)
    return res.map(item => ({ ...item }))
  }
  static async get<T = Entity>(collectionName: string, id: string): Promise<T> {
    const item = _.find(db[collectionName] ?? [], { id })
    return item ? { ...item } : null
  }
  static async create<T = DBRecordFields>(
    collectionName: string,
    attrs: T,
  ): Promise<T & BaseEntity> {
    const newRecord = {
      ...attrs,
      id: v4(),
      createdAt: DateTime.utc().toISO().toString(),
      updatedAt: DateTime.utc().toISO().toString(),
    }
    db[collectionName] = db[collectionName] ?? []
    db[collectionName].push(newRecord)
    return newRecord
  }
  static async update<T = Entity>(
    collectionName: string,
    findAttrs: Partial<T>,
    patch: Partial<T>,
  ): Promise<T[]> {
    const safePatch = _.omit(patch, 'id')
    const res = _.filter(db[collectionName] ?? [], findAttrs)
    res.forEach(item =>
      Object.assign(
        item,
        {
          updatedAt: DateTime.utc().toISO().toString(),
        },
        safePatch,
      ),
    )
    return res.map<T>(item => ({ ...item } as T))
  }
  static async remove<T = Entity>(
    collectionName: string,
    findAttrs: Partial<T>,
  ): Promise<T[]> {
    return _.remove(db[collectionName] ?? [], _.matches(findAttrs))
  }

  constructor(private collectionName: string) {}

  async find<T = Entity>(attrs: Partial<T>): Promise<T[]> {
    return CrudService.find(this.collectionName, attrs)
  }
  async get<T = Entity>(id: string): Promise<T> {
    return CrudService.get(this.collectionName, id)
  }
  async create<T = DBRecordFields>(attrs: T): Promise<T & BaseEntity> {
    return CrudService.create(this.collectionName, attrs)
  }
  async update<T = Entity>(
    findAttrs: Partial<T>,
    patch: Partial<T>,
  ): Promise<T[]> {
    return CrudService.update(this.collectionName, findAttrs, patch)
  }
  async remove<T = Entity>(findAttrs: Partial<T>): Promise<T[]> {
    return CrudService.remove(this.collectionName, findAttrs)
  }
}

export default CrudService
