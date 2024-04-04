import Api from './Api'

class PostService {
  create(title, gps, image) {
    return Api().postForm('/post', { title, ...gps, image })
  }
  get(id) {
    return Api().get('/post', { params: { id } })
  }
  delete(id) {
    return Api().delete('/post', { params: { id } })
  }
}

const service = new PostService()

export default service
