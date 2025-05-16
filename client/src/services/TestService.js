import Api from './Api'

class TestService {
  test() {
    return Api().get('/test/image')
  }
}

const service = new TestService()

export default service
