const { deletePost, deleteComment, banUser, hardDestroyImage, markPostNsfw } = require('../controllers/AdminController')
const { authorize, authorizeAdmin, verifyAdmin } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/admin/check', authorize, verifyAdmin, (req, res) => res.sendStatus(200))
  app.delete('/api/admin/post', authorize, verifyAdmin, deletePost)
  app.delete('/api/admin/comment', authorize, verifyAdmin, deleteComment)
  app.delete('/api/admin/image/destroy', authorize, verifyAdmin, hardDestroyImage)
  app.put('/api/admin/user/ban', authorize, verifyAdmin, banUser)
  app.put('/api/admin/post/nsfw', authorize, verifyAdmin, markPostNsfw)
}
