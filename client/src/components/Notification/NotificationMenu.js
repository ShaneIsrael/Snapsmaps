import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import React from 'react'
import { getAssetUrl } from '../../common/utils'
import clsx from 'clsx'

function NotificationMenu({ trigger, notifications, onMenuClosed }) {
  function createItem(notification) {
    if (notification.postComment) {
      return (
        <DropdownItem
          key={notification.id}
          textValue={`${notification.fromUser.mention} commented on your post`}
          description={
            <p className="overflow-hidden w-56 text-blue-500 text-nowrap truncate">{notification.postComment.body}</p>
          }
          startContent={
            <div>
              <Avatar
                as="button"
                className="transition-transform w-7 h-7"
                color={notification.fromUser.image ? 'default' : 'primary'}
                size="sm"
                src={notification.fromUser.image ? getAssetUrl() + notification.fromUser.image.reference : ''}
              />
            </div>
          }
          className={clsx('text-default-500', { 'opacity-60': notification.read })}
        >
          <>
            <p className="inline text-default-900 font-semibold">{notification.fromUser.mention} </p>
            replied to your post
          </>
        </DropdownItem>
      )
    } else if (notification.follow) {
      return (
        <DropdownItem
          key={notification.id}
          textValue={`${notification.fromUser.mention} followed you`}
          startContent={
            <div>
              <Avatar
                as="button"
                className="transition-transform w-7 h-7"
                color={notification.fromUser.image ? 'default' : 'primary'}
                size="sm"
                src={notification.fromUser.image ? getAssetUrl() + notification.fromUser.image.reference : ''}
              />
            </div>
          }
          className={clsx('text-default-500', { 'opacity-60': notification.read })}
        >
          <>
            <p className="inline text-default-900 font-semibold">{notification.fromUser.mention} </p>
            is now following you
          </>
        </DropdownItem>
      )
    } else if (notification.post) {
      return (
        <DropdownItem
          key={notification.id}
          textValue={`${notification.fromUser.mention} posted a new Snapsmap`}
          startContent={
            <div>
              <Avatar
                as="button"
                className="transition-transform w-7 h-7"
                color={notification.fromUser.image ? 'default' : 'primary'}
                size="sm"
                src={notification.fromUser.image ? getAssetUrl() + notification.fromUser.image.reference : ''}
              />
            </div>
          }
          className={clsx('text-default-500', { 'opacity-60': notification.read })}
        >
          <>
            <p className="inline text-default-900 font-semibold">{notification.fromUser.mention} </p>
            posted a new Snapsmap
          </>
        </DropdownItem>
      )
    } else {
      return (
        <DropdownItem
          key={notification.id}
          textValue={notification.body || '_'}
          description={<p className="overflow-hidden w-56 text-blue-500 text-nowrap truncate">{notification.body}</p>}
          startContent={
            <div>
              <Avatar
                as="button"
                className="transition-transform w-7 h-7"
                color={notification.fromUser.image ? 'default' : 'primary'}
                size="sm"
                src={notification.fromUser.image ? getAssetUrl() + notification.fromUser.image.reference : ''}
              />
            </div>
          }
          className={clsx('text-default-500', { 'opacity-60': notification.read })}
        >
          <>
            <p className="inline text-default-900 font-semibold">{notification.fromUser.mention}</p>
          </>
        </DropdownItem>
      )
    }
  }

  return (
    <Dropdown backdrop="blur" onClose={onMenuClosed} className="dark min-w-0">
      <DropdownTrigger>{trigger}</DropdownTrigger>
      <DropdownMenu
        variant="faded"
        aria-label="notification list"
        classNames={{
          list: 'max-h-96 overflow-y-scroll',
        }}
      >
        {notifications && notifications?.map((notification) => createItem(notification))}
      </DropdownMenu>
    </Dropdown>
  )
}

export default NotificationMenu
