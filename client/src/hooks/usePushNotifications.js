import { deleteToken, getToken } from 'firebase/messaging'
import { UserService } from '../services'
import { messaging } from '../firebase/firebaseConfig'

const usePushNotifications = () => {
  async function updatePushToken() {
    const token = await getToken(messaging, {
      vapidKey: 'BNsIQTaw-15kRT9i3ZyX4SSTDdoaAq9IJpOcP2lEeXD8fqHJmYqmXwcX_pXdNdq7C8H2Oeq44zQf0fjMTeZx7B8',
    })
    console.log('fcm: ' + token)
    await UserService.updatePushNotificationToken(token)
  }

  async function removeToken() {
    await deleteToken(messaging)
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
  return { requestPermission, updatePushToken, removeToken }
}

export { usePushNotifications }
