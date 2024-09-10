const { create, getById, deleteCollection, removeCollectionItem } = require('../controllers/CollectionController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.get('/api/collection', getById)
  app.post('/api/collection', authorize, create)
  app.delete('/api/collection', authorize, deleteCollection)
  app.delete('/api/collection/item', authorize, removeCollectionItem)
}
