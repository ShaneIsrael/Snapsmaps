import axios from 'axios'
import { getUrl } from '../common/utils'
import { toast } from 'sonner'

const URL = getUrl()

const cancelToken = axios.CancelToken.source()

const instance = axios.create({
  baseURL: `${URL}/api`,
})

instance.interceptors.request.use(async (config) => {
  config.cancelToken = cancelToken.token
  return config
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (!axios.isCancel(error)) {
      if (error.response?.status === 403) {
        window.location.href = '/'
      }
      return Promise.reject(error)
    }
    return null
  },
)
const Api = () => {
  instance.defaults.withCredentials = true
  return instance
}

export default Api
