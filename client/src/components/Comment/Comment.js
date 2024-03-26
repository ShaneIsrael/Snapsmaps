import { Avatar, Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'

function Comment({ comment }) {
  return (
    <Card className="w-full rounded-md">
      <CardBody className="justify-between">
        <div className="flex gap-2">
          <Avatar radius="full" size="md" className="min-w-[40px]" src={comment.user.avatar} />
          <div className="flex flex-col gap-1 items-start justify-center ">
            <h4 className="text-small font-semibold leading-none text-default-600">{comment.user.name}</h4>
            <p className="text-tiny text-default-500 ">{comment.body}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default Comment
