import { Router } from 'express'
import controller from '../controllers/CollectionController.js'
import { authorize } from '../middleware/authorize.js'

class CollectionRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/collection', controller.getById)
    this.router.post('/collection', authorize, controller.create)
    this.router.delete('/collection', authorize, controller.deleteCollection)
    this.router.delete('/collection/item', authorize, controller.removeCollectionItem)
  }
}

export default new CollectionRoutes().router
