import { Router } from 'express'
import controller from '../controllers/CommentController.js'
import { authorize } from '../middleware/authorize.js'

class CommentRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/comment', authorize, controller.create)
    this.router.delete('/comment', authorize, controller.deleteComment)
  }
}

export default new CommentRoutes().router
