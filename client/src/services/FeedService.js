import Api from './Api'

class FeedService {
  getPublicFeed() {
    return Api().get('/feed')
  }
  getFollowingFeed() {
    return Api().get('/feed/following')
  }
}

const service = new FeedService()

export default service
