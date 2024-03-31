const { update, postHistory } = require('../controllers/ProfileController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.put('/api/profile', authorize, update)
  app.get('/api/profile/history', authorize, postHistory)
}
