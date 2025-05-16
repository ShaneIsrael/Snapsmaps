import { Router } from 'express'
import controller from '../controllers/AuthController.js'
import { authorize } from '../middleware/authorize.js'

class AuthRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/auth/register', controller.register)
    this.router.post('/auth/login', controller.login)
    this.router.post('/auth/logout', authorize, controller.logout)
    this.router.get('/auth/session', controller.hasSession)
    this.router.get('/auth/verify/:email/:token', controller.verifyEmail)
  }
}

export default new AuthRoutes().router
