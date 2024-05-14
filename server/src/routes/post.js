const { create, getById, deletePost, getPostLikes } = require('../controllers/PostController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/post', getById)
  app.get('/api/post/likes', getPostLikes)
  app.post('/api/post', authorize, create)
  app.delete('/api/post', authorize, deletePost)
}
