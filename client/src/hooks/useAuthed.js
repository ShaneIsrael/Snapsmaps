import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'
import { UserService } from '../services'
import { toast } from 'sonner'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '../firebase/firebaseConfig'

const useAuthed = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function updatePushToken() {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_WEB_PUSH_KEY,
    })
    console.log(token)
    await UserService.updatePushNotificationToken(token)
  }
  async function requestPermission() {
    //requesting permission using Notification API
    const status = await navigator.permissions.query({ name: 'notifications' })
    if (status.state === 'prompt') {
      toast.info('Snapsmaps uses push notifications, please configure them', {
        action: {
          label: 'Configure',
          onClick: async () => {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
              updatePushToken()
            }
          },
        },
      })
    }
    if (status.state === 'granted') {
      updatePushToken()
    } else if (status.state === 'denied') {
      console.log('You denied push notifications')
    }
  }
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = (await AuthService.hasSession()).data
        if (!!session) {
          requestPermission()
        }
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
