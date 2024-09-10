const { post, collection } = require('../controllers/ShareController')

module.exports = (app) => {
  app.get('/share/post/:id', post)
  app.get('/share/collection/:id', collection)
}
