import {
  handleHttpError,
  handleInternalErrors,
  handleNotFound,
  handleValidationErrors,
} from './controller'

// Order of handlers makes sense!
const errorController = [
  handleNotFound,
  handleValidationErrors,
  handleHttpError,
  handleInternalErrors,
]

export default errorController
