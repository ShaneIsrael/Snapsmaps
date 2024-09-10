import Api from './Api'

class CollectionService {
  create(title, publicCollection, image, items, onUploadProgress, signal) {
    return Api().postForm(
      '/collection',
      { title, public: publicCollection, image, items },
      {
        timeout: 300 * 1000,
        signal,
        onUploadProgress: (event) => {
          const { loaded, total } = event
          let percent = Math.floor((loaded * 100) / total)
          onUploadProgress(percent, loaded / 1024 / 1024, total / 1024 / 1024)
        },
      },
    )
  }
  get(id) {
    return Api().get('/collection', { params: { id } })
  }
  delete(id) {
    return Api().delete('/collection', { params: { id } })
  }
}

const service = new CollectionService()

export default service
