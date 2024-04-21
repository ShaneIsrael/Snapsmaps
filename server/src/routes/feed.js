const { public, following } = require('../controllers/FeedController')
const { authorize } = require('../middleware/authorize')
const { publicCache, privateCache } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/feed', publicCache(30), public)
  app.get('/api/feed/following', authorize, privateCache(30), following)
}
