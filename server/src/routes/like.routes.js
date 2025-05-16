import { Router } from 'express'
import controller from '../controllers/LikeController.js'
import { authorize } from '../middleware/authorize.js'

class LikeRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/likedPost', authorize, controller.likedPost)
    this.router.post('/likePost', authorize, controller.likePost)
  }
}

export default new LikeRoutes().router
