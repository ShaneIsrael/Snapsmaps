import { useEffect, useState } from 'react'
import AuthService from '../services/AuthService'
import { messaging } from '../firebase'
import { UserService } from '../services'
import { toast } from 'sonner'

const useAuthed = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pushToken, setPushToken] = useState()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = (await AuthService.hasSession()).data
        if (!!session && !session.pushToken) {
          toast.info('Enable push notifications?', {
            position: 'bottom-center',
            action: {
              label: 'Enable',
              onClick: () => {
                messaging
                  .getToken({ vapidKey: process.env.REACT_APP_FIREBASE_WEB_PUSH_KEY })
                  .then(async (token) => {
                    setPushToken(token)
                    console.log('token', token)
                    await UserService.updatePushNotificationToken(token)
                  })
                  .then((token) => {
                    console.log('Token:', token)
                  })
                  .catch((error) => {
                    console.error('Error:', error)
                  })
              },
            },
          })
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
