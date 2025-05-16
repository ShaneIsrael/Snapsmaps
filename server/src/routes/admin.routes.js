import controller from '../controllers/AdminController'
import { authorize, verifyAdmin } from '../middleware/authorize'

import { Router } from 'express'

class AdminRoutes {
  router = Router()
  constructor() {
    this.initizeRoutes()
  }

  initizeRoutes() {
    this.router.get('/admin/check', authorize, verifyAdmin, (req, res) => res.sendStatus(200))
    this.router.delete('/admin/post', authorize, verifyAdmin, controller.deletePost)
    this.router.delete('/admin/comment', authorize, verifyAdmin, controller.deleteComment)
    this.router.delete('/admin/image/destroy', authorize, verifyAdmin, controller.hardDestroyImage)
    this.router.put('/admin/user/ban', authorize, verifyAdmin, controller.banUser)
    this.router.put('/admin/post/nsfw', authorize, verifyAdmin, controller.markPostNsfw)
  }
}

export default new AdminRoutes().router
