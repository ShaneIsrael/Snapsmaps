import Api from './Api'

class AdminService {
  isAdmin() {
    return Api().get('/admin/check')
  }
  deletePost(id) {
    return Api().delete('/admin/post', {
      params: { id },
    })
  }
  deleteComment(id) {
    return Api().delete('/admin/comment', {
      params: { id },
    })
  }
  markPostNSFW(id) {
    return Api().put('/admin/post/nsfw', {
      id,
    })
  }
  banUser(mention) {
    return Api().put('/admin/user/ban', {
      mention,
    })
  }
}

const service = new AdminService()

export default service
