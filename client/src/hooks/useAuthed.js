import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'

const useAuthed = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authed = (await AuthService.hasSession()).data
        setIsAuthenticated(authed)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    setLoading(true)
    checkAuthStatus()
  }, [])

  return { loading, isAuthenticated }
}

export { useAuthed }
