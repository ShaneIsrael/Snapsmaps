import Api from './Api'

class PostService {
  create(title, publicPost, nsfw = false, gps, image, locationEnabled, onUploadProgress, signal) {
    return Api().postForm(
      '/post',
      { title, public: publicPost, nsfw, ...gps, image, locationEnabled },
      {
        timeout: 300 * 1000,
        signal,
        onUploadProgress: (event) => {
          const { loaded, total } = event
          let percent = Math.floor((loaded * 100) / total)
          onUploadProgress(percent, loaded / 1024 / 1024, total / 1024 / 1024)
        },
      },
    )
  }
  get(id) {
    return Api().get('/post', { params: { id } })
  }
  delete(id) {
    return Api().delete('/post', { params: { id } })
  }
  getPostLikes(id, lastDate, pageSize = 25) {
    return Api().get('/post/likes', { params: { id, lastDate, pageSize } })
  }
}

const service = new PostService()

export default service
