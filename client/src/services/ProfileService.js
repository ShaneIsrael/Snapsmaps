import Api from './Api'

class ProfileService {
  update(profile) {
    return Api().putForm('/profile', { ...profile })
  }
  getPostHistory() {
    return Api().get('/profile/history')
  }
  getProfileByMention(mention) {
    return Api().get('/profile/mention', { params: { mention } })
  }
  getMentionPostHistory(mention) {
    return Api().get('/profile/history/mention', { params: { mention } })
  }
}

const service = new ProfileService()

export default service
