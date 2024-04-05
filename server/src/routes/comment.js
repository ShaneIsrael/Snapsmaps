const { create, deleteComment } = require('../controllers/CommentController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.post('/api/comment', authorize, create)
  app.delete('/api/comment', authorize, deleteComment)
}
