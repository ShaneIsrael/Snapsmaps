import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyDA3axtx7R-dr0jQJ_OJjaqJG_3Jt4widA',
  authDomain: 'snapsmaps-bdb45.firebaseapp.com',
  projectId: 'snapsmaps-bdb45',
  storageBucket: 'snapsmaps-bdb45.appspot.com',
  messagingSenderId: '1037697565957',
  appId: '1:1037697565957:web:7f09be62d787b47d04e36c',
  measurementId: 'G-JWP8XMG97T',
}

const app = initializeApp(firebaseConfig)

export const messaging = getMessaging(app)
