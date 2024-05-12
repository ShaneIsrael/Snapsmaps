import Api from './Api'

class PostService {
  create(title, publicPost, gps, image, onUploadProgress, signal) {
    return Api().postForm(
      '/post',
      { title, public: publicPost, ...gps, image },
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
}

const service = new PostService()

export default service
