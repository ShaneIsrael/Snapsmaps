import AuthService from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { usePushNotifications } from './usePushNotifications'

const useAuth = () => {
  const navigate = useNavigate()
  const { removeToken } = usePushNotifications()
  const logout = async () => {
    try {
      await AuthService.logout()
      // remove this client from firebase messaging
      removeToken()
      navigate('/login')
    } catch (err) {
      throw err
    }
  }

  const login = async (email, password) => {
    const { requestPermission } = usePushNotifications()
    try {
      await AuthService.login(email, password)
      requestPermission()
    } catch (err) {
      throw err
    }
  }

  return { login, logout }
}

export { useAuth }
