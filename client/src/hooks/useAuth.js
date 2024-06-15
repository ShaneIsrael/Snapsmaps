import AuthService from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { deleteToken } from 'firebase/messaging'
import { messaging } from '../firebase/firebaseConfig'

const useAuth = () => {
  const navigate = useNavigate()
  const logout = async () => {
    try {
      await AuthService.logout()
      // remove this client from firebase messaging
      await deleteToken(messaging)
      navigate('/login')
    } catch (err) {
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      await AuthService.login(email, password)
    } catch (err) {
      throw err
    }
  }

  return { login, logout }
}

export { useAuth }
