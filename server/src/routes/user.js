const { search } = require('../controllers/UserController')
const { authorize } = require('../middleware/authorize')
const { publicCache } = require('../middleware/cache')

module.exports = (app) => {
  app.get('/api/user/search', authorize, publicCache(30), search)
}
