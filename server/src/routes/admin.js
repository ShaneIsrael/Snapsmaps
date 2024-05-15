const { test } = require('../controllers/AdminController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/admin/test', authorize, test)
}
