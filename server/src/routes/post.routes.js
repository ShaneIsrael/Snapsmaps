import { Router } from 'express'
import controller from '../controllers/PostController'
import { authorize } from '../middleware/authorize'

class PostRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/post', controller.getById)
    this.router.get('/post/likes', controller.getPostLikes)
    this.router.post('/post', authorize, controller.create)
    this.router.delete('/post', authorize, controller.deletePost)
  }
}

export default new PostRoutes().router
