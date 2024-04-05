import React from 'react'
import {
  Avatar,
  CardBody,
  Card,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { getAssetUrl, getSessionUser } from '../../common/utils'
import clsx from 'clsx'
import { formatDistanceStrict, subDays } from 'date-fns'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { CommentService } from '../../services'
function Comment({ comment }) {
  const profileImage = comment?.user.image
  const currentUser = getSessionUser()
  const [deleted, setDeleted] = React.useState(false)

  const timeAgo = formatDistanceStrict(new Date(comment.createdAt), new Date(), { addSuffix: true })

  const handleDelete = async () => {
    try {
      await CommentService.delete(comment.id)
      setDeleted(true)
    } catch (err) {
      console.error(err)
    }
  }

  // dont show this comment anymore
  if (deleted) return false

  return (
    <Card className="w-full rounded-md">
      <CardBody className="justify-between p-3">
        <div className="flex gap-2">
          <Avatar
            radius="full"
            size="md"
            className="min-w-[40px]"
            src={profileImage ? getAssetUrl() + profileImage.reference : ''}
          />
          <div className="flex flex-col gap-1 items-start flex-grow ">
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
        {currentUser.mention === comment.user.mention && (
          <Dropdown className="dark min-w-0 p-[1px] w-fit">
            <DropdownTrigger>
              <Button variant="light" size="sm" className="mr-1 mt-1 w-4 h-6 absolute top-0 right-0 min-w-0" isIconOnly>
                <EllipsisVerticalIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="delete" className="text-danger text-center" color="danger" onClick={handleDelete}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardBody>
    </Card>
  )
}

export default Comment
