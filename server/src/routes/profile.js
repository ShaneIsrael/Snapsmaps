const {
  get,
  update,
  getPostHistory,
  getByMention,
  getMentionPostHistory,
  followProfile,
  unfollowProfile,
} = require('../controllers/ProfileController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/profile', authorize, get)
  app.put('/api/profile', authorize, update)
  app.get('/api/profile/history', authorize, getPostHistory)
  app.get('/api/profile/history/mention', getMentionPostHistory)
  app.get('/api/profile/mention', getByMention)
  app.post('/api/profile/follow', authorize, followProfile)
  app.delete('/api/profile/follow', authorize, unfollowProfile)
}
