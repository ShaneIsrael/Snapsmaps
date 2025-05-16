import { Router } from 'express'
import controller from '../controllers/UserController'
import { authorize, requireSession } from '../middleware/authorize'
import cache from '../middleware/cache'

class UserRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/user/search', authorize, cache.publicCache(30), controller.search)
    this.router.get('/user/notifications', requireSession, controller.getNotifications)
    this.router.put('/user/notifications', requireSession, controller.readNotifications)
    this.router.put('/user/push/token', requireSession, controller.updatePushToken)
  }
}

export default new UserRoutes().router
