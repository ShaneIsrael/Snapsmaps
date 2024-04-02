const { update, getPostHistory, getByMention, getMentionPostHistory } = require('../controllers/ProfileController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.put('/api/profile', authorize, update)
  app.get('/api/profile/history', authorize, getPostHistory)
  app.get('/api/profile/history/mention', getMentionPostHistory)
  app.get('/api/profile/mention', getByMention)
}
