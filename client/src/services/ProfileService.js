import Api from './Api'

class ProfileService {
  update(profile) {
    return Api().putForm('/profile', { ...profile })
  }
  getPostHistory() {
    return Api().get('/profile/history')
  }
}

const service = new ProfileService()

export default service
