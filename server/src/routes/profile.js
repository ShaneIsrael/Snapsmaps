const { join } = require('path')
const {
  get,
  update,
  getPostHistory,
  getByMention,
  getMentionPostHistory,
  followProfile,
  unfollowProfile,
  getFollowers,
  getFollowing,
} = require('../controllers/ProfileController')
const { authorize } = require('../middleware/authorize')
const { publicCache, privateCache } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/profile', authorize, get)
  app.get('/api/profile/followers', privateCache(30), getFollowers)
  app.get('/api/profile/following', privateCache(30), getFollowing)
  app.get('/api/profile/mention', publicCache(30), getByMention)
  app.get('/api/profile/history', authorize, getPostHistory)
  app.get('/api/profile/history/mention', publicCache(30), getMentionPostHistory)
  app.put('/api/profile', authorize, update)
  app.post('/api/profile/follow', authorize, followProfile)
  app.delete('/api/profile/follow', authorize, unfollowProfile)
}
