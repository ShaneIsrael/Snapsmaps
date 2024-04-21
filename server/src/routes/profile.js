const { join } = require('path')
const {
  get,
  update,
  getPostHistory,
  getByMention,
  getMentionPostHistory,
  followProfile,
  unfollowProfile,
} = require('../controllers/ProfileController')
const { authorize } = require('../middleware/authorize')
const { publicCache } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/profile', authorize, get)
  app.put('/api/profile', authorize, update)
  app.get('/api/profile/history', authorize, getPostHistory)
  app.get('/api/profile/history/mention', publicCache(30), getMentionPostHistory)
  app.get('/api/profile/mention', publicCache(30), getByMention)
  app.post('/api/profile/follow', authorize, followProfile)
  app.delete('/api/profile/follow', authorize, unfollowProfile)
}
