import express from 'express'
import coinController from '../controllers/coin'
import errorController from '../controllers/error'
import userController from '../controllers/user'
import userBalanceController from '../controllers/userBalance'

const apiV1 = express.Router()

apiV1.use(userController)
apiV1.use(userBalanceController)
apiV1.use(coinController)
apiV1.use(errorController)

export default apiV1
