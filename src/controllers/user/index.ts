import express from 'express'
import { validateIdParam } from '../../common/commonValidation'
import { validateCreateUser, validateUpdateUser } from './validation'
import { createUser, getUser, updateUser } from './controller'

const userController = express.Router()

userController.post('/users', validateCreateUser, createUser)

userController.get('/users/:id', validateIdParam('id'), getUser)

userController.put(
  '/users/:id',
  validateIdParam('id'),
  validateUpdateUser,
  updateUser,
)

export default userController
