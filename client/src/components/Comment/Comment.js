import { Avatar, Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'
import { getSessionUser, getUrl } from '../../common/utils'
import clsx from 'clsx'
import { formatDistanceStrict, subDays } from 'date-fns'

function Comment({ comment }) {
  const profileImage = comment?.user.image
  const currentUser = getSessionUser()

  const timeAgo = formatDistanceStrict(new Date(comment.createdAt), new Date(), { addSuffix: true })

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
            <div className="flex flex-row items-start gap-1">
              <p
                className={clsx('text-xs font-semibold leading-none', {
                  'text-blue-400': currentUser?.mention === comment.user.mention,
                  'text-orange-400': currentUser?.mention !== comment.user.mention,
                })}
              >
                {comment.user.mention}
              </p>
              <p className="text-tiny font-semibold leading-none text-neutral-200">•</p>
              <p className={clsx('text-xs font-semibold leading-none text-neutral-400')}>{timeAgo}</p>
            </div>
            <p className="text-tiny text-default-600 ">{comment.body}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default Comment
