import { RequestHandler } from 'express'
import _ from 'lodash'
import { httpAssert } from '../../common/utils'
import CrudService from '../../services/crudService'
import { isUsernameFree, isEmailFree } from '../../services/userService'
import { NewUser, User } from '../../types/entities'

const UserModel = new CrudService('users')

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, username, email } = req.body
    const isEmailAvailable: boolean = await isEmailFree(email)
    const isUsernameAvailable: boolean = await isUsernameFree(username)
    httpAssert(isEmailAvailable, 422, 'Another user uses this email.')
    httpAssert(isUsernameAvailable, 422, 'Another user uses this username.')
    const user: User = await UserModel.create<NewUser>({
      name,
      username,
      email,
      bitcoinAmount: 0,
      usdBalance: 0,
    })
    res.status(201)
    res.send(user)
  } catch (e) {
    next(e)
  }
}

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user: User = await UserModel.get<User>(req.params.id)
    httpAssert(user, 404, 'User not found.')
    res.send(user)
  } catch (e) {
    next(e)
  }
}

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const patch = _.pick<User>(req.body, 'name', 'username', 'email')
    const user: User[] = await UserModel.update<User>(
      {
        id: req.params.id,
      },
      patch,
    )
    res.status(201)
    res.send(user)
  } catch (e) {
    next(e)
  }
}
