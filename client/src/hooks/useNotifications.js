import { useEffect, useState } from 'react'
import UserService from '../services/UserService'

const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const resp = await UserService.notifications()
      setNotifications(resp.data)
      if (resp.data) {
        setUnreadCount(resp.data.filter((notification) => !notification.read).length || 0)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }
  const read = async () => {
    try {
      if (unreadCount > 0) {
        await UserService.readNotifications()
        refresh()
      }
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    refresh()
  }, [])

  return { loading, notifications, unreadCount, refresh, read }
}

export { useNotifications }
