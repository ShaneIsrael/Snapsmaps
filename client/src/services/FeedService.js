import Api from './Api'

class FeedService {
  getPublicFeed(lastDate) {
    return Api().get('/feed', {
      params: {
        lastDate,
      },
    })
  }
  getFollowingFeed(lastDate) {
    return Api().get('/feed/following', {
      params: {
        lastDate,
      },
    })
  }
}

const service = new FeedService()

export default service
