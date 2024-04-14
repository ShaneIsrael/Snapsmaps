import Api from './Api'

class AuthService {
  login(email, password) {
    return Api().post('/auth/login', { email, password })
  }
  register(email, displayName, mention, password) {
    return Api().post('/auth/register', { email, displayName, mention, password, displayName })
  }
  logout() {
    return Api().post('/auth/logout')
  }
  hasSession() {
    return Api().get('/auth/session')
  }
  verify(email, token) {
    return Api().get('/auth/verify', {
      params: {
        email,
        token,
      },
    })
  }
}

const service = new AuthService()

export default service
