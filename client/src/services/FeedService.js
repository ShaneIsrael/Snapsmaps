import Api from './Api'

class FeedService {
  getPublicFeed(page, pageSize) {
    return Api().get('/feed', {
      params: {
        page,
        pageSize,
      },
    })
  }
  getFollowingFeed(page, pageSize) {
    return Api().get('/feed/following', {
      params: {
        page,
        pageSize,
      },
    })
  }
}

const service = new FeedService()

export default service
