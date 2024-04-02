import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'
import { getSessionUser } from '../common/utils'

const useAuthed = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = getSessionUser()
        setIsAuthenticated(!!session)
        setUser(session)
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
