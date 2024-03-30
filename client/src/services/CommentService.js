import Api from './Api'

class CommentService {
  createPostComment(postId, body) {
    return Api().post('/comment', { postId, body })
  }
}

const service = new CommentService()

export default service
