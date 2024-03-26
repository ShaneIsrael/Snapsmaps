import Cookies from 'js-cookie'
import Api from './Api'

class AuthService {
  login(email, password) {
    return Api().post('/auth/login', { email, password })
  }
  register(email, password, displayName) {
    return Api().post('/auth/register', { email, password, displayName })
  }
  logout() {
    return Api().post('/auth/logout')
  }
  hasSession() {
    return Api().get('/auth/session')
  }
}

const service = new AuthService()

export default service
