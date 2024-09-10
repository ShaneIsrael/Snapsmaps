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
  getCollections,
  getMentionCollections,
} = require('../controllers/ProfileController')
const { authorize } = require('../middleware/authorize')
const { publicCache, privateCache } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/profile', authorize, get)
  app.get('/api/profile/followers', authorize, privateCache(30), getFollowers)
  app.get('/api/profile/following', authorize, privateCache(30), getFollowing)
  app.get('/api/profile/mention', getByMention)
  app.get('/api/profile/history', authorize, getPostHistory)
  app.get('/api/profile/history/mention', publicCache(30), getMentionPostHistory)
  app.get('/api/profile/collections', authorize, getCollections)
  app.get('/api/profile/collections/mention', publicCache(30), getMentionCollections)
  app.put('/api/profile', authorize, update)
  app.post('/api/profile/follow', authorize, followProfile)
  app.delete('/api/profile/follow', authorize, unfollowProfile)
}
