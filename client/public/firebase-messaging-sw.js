// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')

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

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)
  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
