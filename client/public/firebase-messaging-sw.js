// // This a service worker file for receiving push notifitications.
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyDA3axtx7R-dr0jQJ_OJjaqJG_3Jt4widA',
  authDomain: 'snapsmaps-bdb45.firebaseapp.com',
  projectId: 'snapsmaps-bdb45',
  storageBucket: 'snapsmaps-bdb45.appspot.com',
  messagingSenderId: '1037697565957',
  appId: '1:1037697565957:web:7f09be62d787b47d04e36c',
  measurementId: 'G-JWP8XMG97T',
}

initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = getMessaging()

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)
  // Customize notification here
  const notification = payload.data
  const notificationTitle = notification.title
  const notificationOptions = {
    body: notification.body,
    icon: 'https://cdn.snapsmaps.com' + notification.badge,
    badge: 'https://cdn.snapsmaps.com' + notification.badge,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  if (event.notification.data && event.notification.data.link) {
    self.clients.openWindow(event.notification.data.link)
  } else {
    self.clients.openWindow(event.currentTarget.origin)
  }

  // close notification after click
  event.notification.close()
})
