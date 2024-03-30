import Api from './Api'

class LikeService {
  hasLikePost(id) {
    return Api().get('/likedPost', { params: { id } })
  }
  likePost(id) {
    return Api().post('/likePost', { id })
  }
}

const service = new LikeService()

export default service
