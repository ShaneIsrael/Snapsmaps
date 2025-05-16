import { Router } from 'express'
import controller from '../controllers/ShareController'

class ShareRoutes {
  router = Router()
  constructor() {
    this.initizeRoutes()
  }

  initizeRoutes() {
    this.router.get('/share/post/:id', controller.post)
    this.router.get('/share/collection/:id', controller.collection)
  }
}

export default new ShareRoutes().router
