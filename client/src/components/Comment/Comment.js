import { Avatar, Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'
import { getSessionUser, getUrl } from '../../common/utils'
import clsx from 'clsx'

function Comment({ comment }) {
  const profileImage = comment?.user.image
  const currentUser = getSessionUser()

  return (
    <Card className="w-full rounded-md">
      <CardBody className="justify-between">
        <div className="flex gap-2">
          <Avatar
            radius="full"
            size="md"
            className="min-w-[40px]"
            src={profileImage ? `${getUrl()}/${profileImage.reference}` : ''}
          />
          <div className="flex flex-col gap-1 items-start ">
            <h4
              className={clsx('text-tiny font-semibold leading-none', {
                'text-blue-400': currentUser.mention === comment.user.mention,
                'text-orange-400': currentUser.mention !== comment.user.mention,
              })}
            >
              {comment.user.mention}
            </h4>
            <p className="text-tiny text-default-500 ">{comment.body}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default Comment
