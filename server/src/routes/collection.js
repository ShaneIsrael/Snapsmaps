const { create, getById, deleteCollection } = require('../controllers/CollectionController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/collection', getById)
  app.post('/api/collection', authorize, create)
  app.delete('/api/collection', authorize, deleteCollection)
}
