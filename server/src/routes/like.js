const { likedPost, likePost } = require('../controllers/LikeController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/likedPost', authorize, likedPost)
  app.post('/api/likePost', authorize, likePost)
}
