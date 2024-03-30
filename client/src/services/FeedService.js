import Api from './Api'

class FeedService {
  getPublicFeed() {
    return Api().get('/feed')
  }
}

const service = new FeedService()

export default service
