const { create, getById, deletePost } = require('../controllers/PostController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/post', getById)
  app.post('/api/post', authorize, create)
  app.delete('/api/post', authorize, deletePost)
}
