const { create, getById } = require('../controllers/PostController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.post('/api/post', authorize, create)
  app.get('/api/post', authorize, getById)
}
