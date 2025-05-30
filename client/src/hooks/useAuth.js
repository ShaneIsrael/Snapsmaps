import AuthService from '../services/AuthService'
import { useNavigate } from 'react-router-dom'

const useAuth = () => {
  const navigate = useNavigate()
  const logout = async () => {
    try {
      await AuthService.logout()
      navigate('/')
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
