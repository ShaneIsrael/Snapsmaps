import React, { useEffect } from 'react'
import clsx from 'clsx'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tab,
  Tabs,
  Textarea,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
  Tooltip,
} from '@nextui-org/react'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import Comment from '../Comment/Comment'
import { downloadFile, getAssetUrl } from '../../common/utils'
import { CommentService, LikeService, PostService } from '../../services'
import { formatDistanceStrict } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  EllipsisVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid'
import {
  ArrowsPointingOutIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  HeartIcon as HeartIconOutlined,
} from '@heroicons/react/24/outline'
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/solid'
import SnapMap from '../Map/SnapMap'
import { toast } from 'sonner'
import Nsfw2 from '../../assets/icons/Nsfw2'
import ConfirmationDialog from '../Dialog/ConfirmationDialog'

function Post({
  post,
  isSelf,
  defaultFollowed,
  defaultLiked,
  defaultSelectedTab,
  onOpenModal,
  isSingle,
  user,
  isAuthenticated,
}) {
  const [intPost, setIntPost] = React.useState(post)
  const [revealed, setRevealed] = React.useState(!post.nsfw)
  const [isFollowed, setIsFollowed] = React.useState(defaultFollowed)
  const [selectedTab, setSelectedTab] = React.useState(defaultSelectedTab || 'photo')
  const [liked, setLiked] = React.useState(defaultLiked)
  const [comment, setComment] = React.useState('')
  const [deleted, setDeleted] = React.useState(false)
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const navigate = useNavigate()

  const postImage = getAssetUrl() + intPost?.image?.reference

  async function reload() {
    try {
      setComment('')
      const postData = (await PostService.get(post.id)).data
      setIntPost(postData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLike = async () => {
    if (isAuthenticated) {
      try {
        await LikeService.likePost(post.id)
        reload()
        setLiked((prev) => !prev)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const submitComment = async () => {
    if (isAuthenticated) {
      try {
        await CommentService.createPostComment(post.id, comment)
        reload()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleDelete = () => {
    setConfirmDelete(false)
    setTimeout(async () => {
      try {
        await PostService.delete(post.id)
        setDeleted(true)
      } catch (err) {
        console.error(err)
      }
    }, 750)
  }

  const handleCommentKeydown = (e) => {
    if (e.key === 'Enter') {
      if (comment) {
        submitComment()
      }
    }
  }

  useEffect(() => {
    if (selectedTab === 'comments') {
      reload()
    }
  }, [selectedTab])

  const hasProfileImage = !!intPost?.user?.image
  const timeAgo = formatDistanceStrict(new Date(intPost.createdAt), new Date(), { addSuffix: true })

  // don't show the post on the feed anymore.
  if (deleted) return false

  function canBrowserShareData(data) {
    if (!navigator.share || !navigator.canShare) {
      return false
    }

    return navigator.canShare(data)
  }

  const handleSharePost = async () => {
    const shareLink = `${window.location.origin}/user/${intPost.user?.mention}/${intPost.id}`
    try {
      if (canBrowserShareData({ url: shareLink })) {
        await navigator.share({ url: shareLink })
      } else {
        await navigator.clipboard.writeText(shareLink)
        toast.info('Link copied to clipboard.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <ConfirmationDialog
        open={confirmDelete}
        title="Are you sure?"
        body="This action is not reversible."
        actionText="Delete Post"
        actionColor="danger"
        cancelColor="default"
        onAction={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
      <Card
        className={clsx('sm:w-full rounded-none bg-background border-none sm:min-w-[450px]', {
          'w-screen': !isSingle,
        })}
      >
        <CardHeader className="justify-between p-0">
          <div className="flex m-4 gap-3 cursor-pointer">
            <Avatar
              isBordered
              color={isSelf ? 'primary' : 'default'}
              radius="full"
              size="md"
              onClick={() => {
                if (user?.mention === intPost?.user?.mention) {
                  navigate('/profile')
                } else {
                  navigate(`/user/${intPost?.user?.mention}`)
                }
              }}
              src={hasProfileImage ? getAssetUrl() + intPost?.user?.image?.reference : ''}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4
                className={clsx('text-md font-semibold leading-none text-default-600 hover:text-neutral-50', {
                  'text-primary-500': isSelf,
                })}
                onClick={() => navigate(`/user/${intPost?.user?.mention}`)}
              >
                {intPost?.user?.displayName}
              </h4>

              <h5 className="text-small font-semibold tracking-normal text-slate-400">@{intPost?.user?.mention}</h5>
            </div>
          </div>
          {isAuthenticated && (
            <Dropdown className="dark min-w-0 p-[1px] w-fit bg-black">
              <DropdownTrigger>
                <Button variant="light" size="sm" className="mr-2 mt-[-24px]" isIconOnly>
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="post actions">
                <DropdownItem
                  key="download"
                  className="text-neutral-100"
                  onClick={() => downloadFile(post?.image?.reference)}
                  startContent={<ArrowDownTrayIcon className="h-4 w-4" />}
                >
                  Download photo
                </DropdownItem>
                <DropdownItem
                  showDivider={isSelf}
                  key="share"
                  className="text-neutral-100"
                  onClick={handleSharePost}
                  startContent={<ShareIcon className="h-4 w-4" />}
                >
                  Share
                </DropdownItem>

                {isSelf && (
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onClick={() => setConfirmDelete(true)}
                    startContent={<XMarkIcon className="h-4 w-4" />}
                  >
                    Delete Post
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
        </CardHeader>
        <CardBody className="py-0 text-small text-default-500 overflow-hidden px-0">
          {intPost?.title && (
            <div className="mb-3 mx-3">
              <p className="text-default-600 font-semibold leading-4 max-h-[65px] min-h-[20px] overflow-y-auto">
                {intPost?.title}
              </p>
            </div>
          )}
          <Tabs
            aria-label="post tabs"
            color="primary"
            radius="full"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            className="block "
            variant="solid"
            size="sm"
            autoFocus={false}
            classNames={{
              tabList: 'bg-slate-900 mx-3',
              panel: 'pt-2 px-0',
            }}
          >
            <Tab
              key={`photo`}
              title={
                <div className="flex items-center space-x-2">
                  <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== `photo` })} />
                  <span></span>
                </div>
              }
            >
              <div
                className={clsx('relative w-full h-full cursor-pointer [&>div]:hover:flex  overflow-y-hidden', {
                  'max-h-[598px]': !isSingle,
                  'max-h-[400px] overflow-y-scroll': isSingle,
                })}
              >
                {revealed && (
                  <>
                    <div className="absolute hidden right-2 top-2 pointer-events-none z-10">
                      <Button size="sm" isIconOnly variant="flat">
                        <ArrowsPointingOutIcon className="stroke-neutral-100/80 w-8 h-8" />
                      </Button>
                    </div>
                    {intPost.nsfw && (
                      <div className="absolute hidden right-2 top-12 z-10">
                        <Button size="sm" isIconOnly variant="flat" onClick={() => setRevealed(false)}>
                          <EyeSlashIcon className="text-neutral-100/80 opacity-80 w-6 h-6" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
                {!revealed && (
                  <div className="absolute flex flex-col items-center gap-2 pointer-events-none z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Button size="lg" isIconOnly variant="flat" className="">
                      <Nsfw2 className="stroke-neutral-100/10 w-8 h-8 opacity-70" />
                    </Button>
                    <div className="text-md font-bold text-neutral-100/70 bg-default/40 p-1 px-3 rounded-2xl ">
                      View NSFW Content
                    </div>
                  </div>
                )}
                <img
                  onClick={revealed ? () => onOpenModal(postImage) : () => setRevealed(true)}
                  className={clsx('object-cover w-full h-full', { 'blur-lg': intPost.nsfw && !revealed })}
                  alt="a post image"
                  src={postImage}
                />
              </div>
            </Tab>
            <Tab
              key={`map`}
              title={
                <div className="flex items-center space-x-2">
                  <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== `map` })} />
                  <span></span>
                </div>
              }
            >
              <div className="overflow-hidden h-[365px] min-w-[284px]">
                <SnapMap
                  markers={[{ lat: intPost?.image?.latitude, lng: intPost?.image?.longitude }]}
                  defaultZoom={14}
                  streetViewControl
                />
              </div>
            </Tab>
            <Tab
              key={`comments`}
              title={
                <div className="flex items-center space-x-2">
                  {selectedTab !== `comments` ? (
                    <ChatBubbleLeftRightIcon className="w-6 h-6 stroke-neutral-200" />
                  ) : (
                    <ChatBubbleLeftRightIconSolid className="w-6 h-6" />
                  )}
                  <span></span>
                  {intPost.commentCount > 0 && (
                    <Chip size="sm" variant="faded">
                      {intPost.commentCount}
                    </Chip>
                  )}
                </div>
              }
            >
              <div className="h-[365px] min-w-[284px] flex flex-col  px-2">
                {intPost.postComments.length > 0 && (
                  <div className="h-full overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {intPost.postComments.map((comment) => (
                        <Comment key={`post-${post.id}-comment-${comment.id}`} comment={comment} user={user} />
                      ))}
                    </div>
                  </div>
                )}
                {intPost.postComments.length === 0 && (
                  <div className="flex flex-col h-full justify-center align-middle">
                    <h2 className="text-center text-lg font-bold text-blue-600">
                      {isAuthenticated ? 'Be the first to comment' : 'no comments'}
                    </h2>
                  </div>
                )}
                {isAuthenticated && (
                  <Textarea
                    variant="flat"
                    labelPlacement="outside"
                    placeholder="Write..."
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value.slice(0, process.env.REACT_APP_MAX_POST_COMMENT_LENGTH))
                    }
                    maxRows={2}
                    onKeyDown={handleCommentKeydown}
                    className="max-w mt-2"
                    classNames={{
                      inputWrapper: 'rounded-md',
                    }}
                  />
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
        <CardFooter className="gap-3 pt-0">
          <div className="flex w-full flex-row justify-center items-center gap-4 px-2">
            <div className="flex gap-1 ">
              <p className=" text-default-500 text-small cursor-pointer" onClick={handleLike}>
                {liked ? (
                  <HeartIconSolid className="w-5 h-5 fill-red-500" />
                ) : (
                  <HeartIconOutlined className="w-5 h-5 stroke-default-600" />
                )}
              </p>
              {intPost?.likeCount > 0 && (
                <p
                  className="font-semibold text-default-700 text-small cursor-pointer hover:text-blue-500"
                  onClick={() => navigate(`/post/${intPost.id}/likes`)}
                >
                  {intPost?.likeCount}
                  {intPost?.likeCount === 1 ? ' like' : ' likes'}
                </p>
              )}
            </div>
            <div className="flex-grow" />
            <div className="flex gap-2">
              <p className="text-small font-semibold leading-none text-default-600 cursor-default">{timeAgo}</p>
              <Tooltip
                classNames={{
                  content: 'dark text-neutral-400',
                }}
                delay={750}
                content={intPost.public ? 'public post' : 'private post'}
              >
                {intPost.public ? (
                  <EyeIcon className="w-4 text-default-600" />
                ) : (
                  <EyeSlashIcon className="w-4 text-default-600" />
                )}
              </Tooltip>
            </div>
          </div>
        </CardFooter>
      </Card>

      {!isSingle && <Divider />}
    </>
  )
}

export default Post
