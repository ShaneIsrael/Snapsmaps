import { Avatar, Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'
import { getUrl } from '../../common/utils'

function Comment({ comment }) {
  const profileImage = comment?.user.image

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
          <div className="flex flex-col gap-1 items-start justify-center ">
            <h4 className="text-small font-semibold leading-none text-default-600">{comment.user.displayName}</h4>
            <p className="text-tiny text-default-500 ">{comment.body}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default Comment
