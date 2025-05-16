import { Router } from 'express'
import controller from '../controllers/FeedController.js'
import { authorize } from '../middleware/authorize.js'
import cache from '../middleware/cache.js'

class FeedRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/feed', cache.publicCache(30), controller.public)
    this.router.get('/feed/following', authorize, cache.privateCache(30), controller.following)
  }
}

export default new FeedRoutes().router
