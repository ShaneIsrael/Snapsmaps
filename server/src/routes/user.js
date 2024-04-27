const { search, getNotifications, readNotifications } = require('../controllers/UserController')
const { authorize, requireSession } = require('../middleware/authorize')
const { publicCache, privateCache } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/user/search', authorize, publicCache(30), search)
  app.get('/api/user/notifications', requireSession, getNotifications)
  app.put('/api/user/notifications', requireSession, readNotifications)
}
