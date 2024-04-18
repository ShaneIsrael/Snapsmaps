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
}

const service = new UserService()

export default service
