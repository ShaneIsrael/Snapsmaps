import { Router } from 'express'
import controller from '../controllers/ProfileController.js'
import { authorize } from '../middleware/authorize.js'
import cache from '../middleware/cache.js'

class ProfileRoutes {
  router = Router()

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/profile', authorize, controller.get)
    this.router.get('/profile/followers', authorize, cache.privateCache(30), controller.getFollowers)
    this.router.get('/profile/following', authorize, cache.privateCache(30), controller.getFollowing)
    this.router.get('/profile/mention', controller.getByMention)
    this.router.get('/profile/history', authorize, controller.getPostHistory)
    this.router.get('/profile/history/mention', cache.publicCache(30), controller.getMentionPostHistory)
    this.router.get('/profile/collections', authorize, controller.getCollections)
    this.router.get('/profile/collections/mention', cache.publicCache(30), controller.getMentionCollections)
    this.router.put('/profile', authorize, controller.update)
    this.router.post('/profile/follow', authorize, controller.followProfile)
    this.router.delete('/profile/follow', authorize, controller.unfollowProfile)
  }
}

export default new ProfileRoutes().router
