// // This a service worker file for receiving push notifitications.
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyDA3axtx7R-dr0jQJ_OJjaqJG_3Jt4widA',
  authDomain: 'snapsmaps-bdb45.firebaseapp.com',
  projectId: 'snapsmaps-bdb45',
  storageBucket: 'snapsmaps-bdb45.appspot.com',
  messagingSenderId: '1037697565957',
  appId: '1:1037697565957:web:7f09be62d787b47d04e36c',
  measurementId: 'G-JWP8XMG97T',
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  //   // Customize notification here
  const notification = payload.data
  const notificationTitle = notification.title
  const notificationOptions = {
    body: notification.body,
    icon: '/apple-touch-icon.png',
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

// self.addEventListener('notificationclick', (event) => {
//   if (event.notification.data && event.notification.data.link) {
//     self.clients.openWindow(event.notification.data.link)
//   } else {
//     self.clients.openWindow(event.currentTarget.origin)
//   }

//   // close notification after click
//   event.notification.close()
// })
