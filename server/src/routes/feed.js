const { public } = require('../controllers/FeedController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/feed', public)
}
