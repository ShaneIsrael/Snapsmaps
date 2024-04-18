const { search } = require('../controllers/UserController')
const { authorize } = require('../middleware/authorize')
const { cacheResponse } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/user/search', authorize, cacheResponse(30), search)
}
