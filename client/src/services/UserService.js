import Api from './Api'

class UserService {
  search(query, page = 0) {
    return Api().get('/user/search', {
      params: {
        query,
        page,
      },
    })
  }
  notifications() {
    return Api().get('/user/notifications')
  }
  readNotifications() {
    return Api().put('/user/notifications')
  }
}

const service = new UserService()

export default service
