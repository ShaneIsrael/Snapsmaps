import React from 'react'
import {
  Avatar,
  CardBody,
  Card,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { getAssetUrl } from '../../common/utils'
import clsx from 'clsx'
import { formatDistanceStrict, subDays } from 'date-fns'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { AdminService, CommentService } from '../../services'
import { useNavigate } from 'react-router-dom'
import ConfirmationDialog from '../Dialog/ConfirmationDialog'
import { toast } from 'sonner'

function Comment({ comment, user }) {
  const profileImage = comment?.user.image
  const [deleted, setDeleted] = React.useState(false)
  const [confirmAdminAction, setConfirmAdminAction] = React.useState({ open: false })
  const navigate = useNavigate()

  const timeAgo = formatDistanceStrict(new Date(comment.createdAt), new Date(), { addSuffix: true })

  const handleDelete = async () => {
    try {
      await CommentService.delete(comment.id)
      setDeleted(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAdminDelete = async () => {
    AdminService.deleteComment(comment.id)
      .then(() => {
        toast.info('Comment deleted')
        setDeleted(true)
      })
      .catch(() => toast.error('error completing action'))
  }

  // dont show this comment anymore
  if (deleted) return false

  return (
    <>
      <ConfirmationDialog
        open={confirmAdminAction.open}
        title={confirmAdminAction.title}
        body="Are you sure you want to execute this action?"
        actionText="Yes"
        cancelText="No"
        actionColor="warning"
        cancelColor="default"
        onAction={() => {
          confirmAdminAction.action()
          setConfirmAdminAction({ open: false })
        }}
        onCancel={() => setConfirmAdminAction({ open: false })}
      />
      <Card className="w-full rounded-md bg-background border-small border-neutral-800">
        <CardBody className="justify-between p-3">
          <div className="flex gap-2">
            <Avatar
              radius="full"
              size="md"
              className="min-w-[40px] cursor-pointer"
              src={profileImage ? getAssetUrl() + profileImage.reference : ''}
              onClick={() => navigate(`/user/${comment.user.mention}`)}
            />
            <div className="flex flex-col gap-1 items-start flex-grow ">
              <div className="flex flex-row items-start gap-1">
                <p
                  className={clsx('text-xs font-semibold leading-none cursor-pointer', {
                    'text-blue-400': user?.mention === comment.user.mention,
                    'text-neutral-200': user?.mention !== comment.user.mention,
                  })}
                  onClick={() => navigate(`/user/${comment.user.mention}`)}
                >
                  {comment.user.mention}
                </p>
                <p className="text-tiny font-semibold leading-none text-neutral-200">•</p>
                <p className={clsx('text-xs font-semibold leading-none text-neutral-400')}>{timeAgo}</p>
              </div>
              <p className="text-tiny text-default-600 ">{comment.body}</p>
            </div>
          </div>
          {(user?.mention === comment.user.mention || user?.isAdmin) && (
            <Dropdown className="dark min-w-0 p-[1px] w-fit bg-black">
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  className="mr-1 mt-1 w-4 h-6 absolute top-0 right-1 min-w-0"
                  isIconOnly
                >
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Comment actions">
                {(!user?.isAdmin || user?.mention === comment.user.mention) && (
                  <DropdownItem
                    key="delete"
                    className="text-danger text-center"
                    color="danger"
                    onClick={handleDelete}
                    showDivider={user?.isAdmin && user?.mention !== comment.user.mention}
                  >
                    Delete
                  </DropdownItem>
                )}
                {user?.isAdmin && user?.mention !== comment.user.mention && (
                  <DropdownItem
                    key="adminDelete"
                    className="text-warning text-center"
                    color="warning"
                    onClick={() =>
                      setConfirmAdminAction({
                        open: true,
                        title: `Delete ${comment.user.mention}'s comment?`,
                        action: handleAdminDelete,
                      })
                    }
                  >
                    Delete
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default Comment
