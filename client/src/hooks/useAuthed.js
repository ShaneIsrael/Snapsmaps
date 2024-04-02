import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'
import { getSessionUser } from '../common/utils'

const useAuthed = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = getSessionUser()
        setIsAuthenticated(!!session)
        setUser(session)
      } catch (err) {
        console.error(err)
      }
    }
    checkAuthStatus()
  }, [])

  return { user, isAuthenticated }
}

export { useAuthed }
