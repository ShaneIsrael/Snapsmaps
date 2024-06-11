import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import React from 'react'
import { getAssetUrl } from '../../common/utils'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

function NotificationMenu({ trigger, notifications, onMenuClosed }) {
  const navigate = useNavigate()

  function createItem(notification) {
    if (notification.title) {
      return (
        <DropdownItem
          key={notification.id}
          onClick={() => navigate(`/user/${notification.post.user.mention}/${notification.post.id}/comments`)}
          textValue={`${notification.fromUser.mention} ${notification.title}`}
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
            {notification.title}
          </>
        </DropdownItem>
      )
    } else if (notification.postComment) {
      return (
        <DropdownItem
          key={notification.id}
          onClick={() => navigate(`/user/${notification.post.user.mention}/${notification.post.id}/comments`)}
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
            replied to your post.
          </>
        </DropdownItem>
      )
    } else if (notification.follow) {
      return (
        <DropdownItem
          key={notification.id}
          onClick={() => navigate(`/user/${notification.fromUser.mention}`)}
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
            followed you.
          </>
        </DropdownItem>
      )
    } else if (notification.post) {
      return (
        <DropdownItem
          key={notification.id}
          onClick={() => navigate(`/user/${notification.fromUser.mention}/${notification.post.id}`)}
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
            posted.
          </>
        </DropdownItem>
      )
    } else {
      return (
        <DropdownItem
          key={notification.id}
          isReadOnly
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
    <Dropdown backdrop="blur" onClose={onMenuClosed} className="dark min-w-0 bg-black">
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
