import Api from './Api'

class ProfileService {
  update(profile) {
    return Api().putForm('/profile', { ...profile })
  }
}

const service = new ProfileService()

export default service
