import { getMessaging, getToken, onMessage } from 'firebase/messaging'
//....
const messaging = getMessaging()
//....

// Handle incoming messages. Called when:
// - a message is received while the app has focus
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
