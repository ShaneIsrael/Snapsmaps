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
  follow(mention) {
    return Api().post('/profile/follow', { mention })
  }
  unfollow(mention) {
    return Api().delete('/profile/follow', { params: { mention } })
  }
}

const service = new ProfileService()

export default service
