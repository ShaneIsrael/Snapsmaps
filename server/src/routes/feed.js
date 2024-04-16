const { public, following } = require('../controllers/FeedController')
const { authorize } = require('../middleware/authorize')
const { cacheResponse } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/feed', cacheResponse(30), public)
  app.get('/api/feed/following', authorize, cacheResponse(30), following)
}
