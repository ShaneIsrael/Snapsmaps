import React, { useState, useEffect } from 'react'
import { onMessageListener } from './firebase'
import { toast } from 'sonner'

import { getAssetUrl } from '../common/utils'
import clsx from 'clsx'
import { Avatar, CardBody, Card } from '@nextui-org/react'
import { useAuthed } from '../hooks/useAuthed'
import { usePushNotifications } from '../hooks/usePushNotifications'

const PushNotificationHandler = () => {
  const [notification, setNotification] = useState({ title: '', body: '', badge: '' })
  const { loading, isAuthenticated } = useAuthed()
  const { removeToken, requestPermission } = usePushNotifications()

  const notify = () =>
    toast.custom((t) => <ToastDisplay t={t} />, {
      duration: 3500,
      position: 'top-center',
    })
  function ToastDisplay({ t }) {
    return (
      <Card className="dark w-[325px] rounded-md bg-background border-small border-neutral-800">
        <CardBody className="justify-between p-3 cursor-pointer">
          <div className="flex gap-2" onClick={() => toast.dismiss(t)}>
            <Avatar
              radius="full"
              size="md"
              className="min-w-[40px]"
              src={notification.badge ? getAssetUrl() + notification.badge : ''}
            />
            <div className="flex flex-col gap-1 items-start flex-grow ">
              <div className="flex flex-row items-start gap-1">
                <p className={clsx('text-xs font-semibold leading-none cursor-pointer text-blue-400')}>
                  {notification.title}
                </p>
              </div>
              <p className="text-tiny text-default-600 ">{notification.body}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }

  useEffect(() => {
    if (notification?.title) {
      notify()
    }
  }, [notification])

  useEffect(() => {
    if (!loading && isAuthenticated) {
      requestPermission()
    }
    if (!loading && !isAuthenticated) {
      removeToken()
    }
  }, [loading, isAuthenticated])

  onMessageListener()
    .then((payload) => {
      const notification = payload.notification || payload.data
      setNotification({ title: notification?.title, body: notification?.body })
    })
    .catch((err) => console.log('failed: ', err))
}

export default PushNotificationHandler
