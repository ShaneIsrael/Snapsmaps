import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'

const useAuthed = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = (await AuthService.hasSession()).data
        setIsAuthenticated(!!session)
        setUser(session ? session : null)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    checkAuthStatus()
  }, [])

  return { loading, user, isAuthenticated }
}

export { useAuthed }
