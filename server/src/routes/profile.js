const { update } = require('../controllers/ProfileController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.put('/api/profile', authorize, update)
}
