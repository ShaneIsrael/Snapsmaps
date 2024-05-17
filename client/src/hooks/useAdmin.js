import { useEffect, useState } from 'react'
import { AdminService } from '../services'

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        await AdminService.isAdmin()
        setIsAdmin(true)
      } catch (err) {
        setIsAdmin(false)
      }
      setLoading(false)
    }
    checkAdminStatus()
  }, [])

  return { loading, isAdmin }
}

export { useAdmin }
