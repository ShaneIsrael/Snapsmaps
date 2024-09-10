import Api from './Api'

class ProfileService {
  getAuthedProfile() {
    return Api().get('/profile')
  }
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
  getCollections() {
    return Api().get('/profile/collections')
  }
  getMentionCollections(mention) {
    return Api().get('/profile/collections/mention', { params: { mention } })
  }
  follow(mention) {
    return Api().post('/profile/follow', { mention })
  }
  unfollow(mention) {
    return Api().delete('/profile/follow', { params: { mention } })
  }
  getFollowers(mention, lastDate) {
    return Api().get('/profile/followers', { params: { mention, lastDate } })
  }
  getFollowing(mention, lastDate) {
    return Api().get('/profile/following', { params: { mention, lastDate } })
  }
}

const service = new ProfileService()

export default service
