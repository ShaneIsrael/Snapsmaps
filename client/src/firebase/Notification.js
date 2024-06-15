import React, { useState, useEffect } from 'react'
import { requestForToken, onMessageListener } from './firebase'

const Notification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' })

  function ToastDisplay() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    )
  }

  useEffect(() => {
    if (notification?.title) {
      // notify()
    }
  }, [notification])

  onMessageListener()
    .then((payload) => {
      console.log(payload)
      setNotification({ title: payload?.notification?.title, body: payload?.notification?.body })
    })
    .catch((err) => console.log('failed: ', err))
}

export default Notification
