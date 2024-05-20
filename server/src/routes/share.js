const { post } = require('../controllers/ShareController')

module.exports = (app) => {
  app.get('/share/post/:id', post)
}
