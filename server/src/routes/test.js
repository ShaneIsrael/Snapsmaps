const { test } = require('../controllers/TestController')

module.exports = (app) => {
  app.get('/api/test/image', test)
}
