const { public, following } = require('../controllers/FeedController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/feed', public)
  app.get('/api/feed/following', authorize, following)
}
