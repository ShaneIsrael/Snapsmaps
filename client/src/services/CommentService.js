import Api from './Api'

class CommentService {
  createPostComment(postId, body) {
    return Api().post('/comment', { postId, body })
  }
  delete(id) {
    return Api().delete('/comment', { params: { id } })
  }
}

const service = new CommentService()

export default service
