import express from 'express'
import { validateIdParam } from '../../common/commonValidation'
import { createUser, getUser, updateUser } from './controller'
import { validateCreateUser, validateUpdateUser } from './validation'

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
