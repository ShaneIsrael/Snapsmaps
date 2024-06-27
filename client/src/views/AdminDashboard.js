import React, { useEffect } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { loading, isAdmin } = useAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/feed')
    }
  }, [loading])

  if (loading && !isAdmin) {
    return <div>loading...</div>
  }

  return <div className="h-screen w-screen">Welcome Admin</div>
}

export default AdminDashboard
