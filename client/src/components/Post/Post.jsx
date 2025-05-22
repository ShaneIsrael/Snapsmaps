import {
  ArrowsPointingOutIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon as HeartIconOutlined,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  EllipsisVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid'
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/solid'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
} from '@heroui/react'
import clsx from 'clsx'
import { formatDistanceStrict } from 'date-fns'
import React, { useEffect, useCallback, useState } from 'react'
import { GiThorHammer } from 'react-icons/gi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import Nsfw2 from '../../assets/icons/Nsfw2'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { canBrowserShareData, downloadFile, getAssetUrl } from '../../common/utils'
import { AdminService, CommentService, LikeService, PostService } from '../../services'
import Comment from '../Comment/Comment'
import WritePostComment from '../Comment/WritePostComment'
import ConfirmationDialog from '../Dialog/ConfirmationDialog'
import SnapMap from '../Map/SnapMap'

const Post = React.memo(
  ({
    post,
    isSelf,
    defaultFollowed,
    defaultLiked,
    defaultSelectedTab,
    onOpenModal,
    isSingle,
    user,
    isAuthenticated,
  }) => {
    const commentsWrapperRef = React.useRef(null)
    const [intPost, setIntPost] = useState(post)
    const [revealed, setRevealed] = useState(!post.nsfw)
    const [isFollowed, setIsFollowed] = useState(defaultFollowed)
    const [selectedTab, setSelectedTab] = useState(defaultSelectedTab || 'photo')
    const [liked, setLiked] = useState(defaultLiked)
    const [comment, setComment] = useState('')
    const [deleted, setDeleted] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [confirmAdminAction, setConfirmAdminAction] = useState({ open: false })

    const hasLocationData = post?.image?.latitude && post?.image?.longitude

    const navigate = useNavigate()

    const postImage = getAssetUrl() + intPost?.image?.reference
    const postImageLowq = `${getAssetUrl() + intPost?.image?.reference.split('.')[0]}.lowq.webp`

    const reload = async () => {
      try {
        const postData = (await PostService.get(post.id)).data
        setIntPost(postData)
        setRevealed(!postData.nsfw)
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

    const handleDelete = async () => {
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

    useEffect(() => {
      if (selectedTab === 'comments') {
        reload()
      }
    }, [selectedTab])

    useEffect(() => {
      if (commentsWrapperRef.current) {
        commentsWrapperRef.current.scrollTo(0, commentsWrapperRef.current.scrollHeight)
      }
    }, [intPost])

    const hasProfileImage = !!intPost?.user?.image
    const timeAgo = formatDistanceStrict(new Date(intPost.createdAt), new Date(), { addSuffix: true })

    if (deleted) return null

    const handleSharePost = async () => {
      const shareLink = `${window.location.origin}/share/post/${intPost.id}`
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

    const handleAdminBanUser = () => {
      AdminService.banUser(post.user.mention)
        .then(() => toast.info('User banned successfully.'))
        .catch(() => toast.error('Error while attempting action'))
    }

    const handleAdminDeletePost = () => {
      AdminService.deletePost(post.id)
        .then(() => toast.info('Post deleted successfully.'))
        .catch(() => toast.error('Error while attempting action'))
    }

    const handleAdminSetPostNsfw = () => {
      AdminService.markPostNSFW(post.id)
        .then(() => {
          reload()
          toast.info('Post updated successfully')
        })
        .catch(() => toast.error('Error while attempting action'))
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

        <Card
          className={clsx('rounded-none border-none bg-background sm:w-full sm:min-w-[450px]', {
            'w-screen': !isSingle,
          })}
        >
          <CardHeader className="justify-between p-0">
            <div className='m-4 flex cursor-pointer gap-3'>
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
              <div className='flex flex-col items-start justify-center gap-1'>
                <h4
                  className={clsx('font-semibold text-default-600 text-md leading-none hover:text-neutral-50', {
                    'text-primary-500': isSelf,
                  })}
                  onClick={() => navigate(`/user/${intPost?.user?.mention}`)}
                >
                  {intPost?.user?.displayName}
                </h4>

                <h5 className='font-semibold text-slate-400 text-small tracking-normal'>@{intPost?.user?.mention}</h5>
              </div>
            </div>
            {isAuthenticated && (
              <Dropdown className='dark w-fit min-w-0 bg-black p-[1px]'>
                <DropdownTrigger>
                  <Button variant="light" size="sm" className='mt-[-24px] mr-2' isIconOnly>
                    <EllipsisVerticalIcon className='h-5 w-5' />
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
                    showDivider={isSelf || user?.isAdmin}
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
                  {user?.isAdmin && !intPost.nsfw && !isSelf && (
                    <DropdownItem
                      key="adminSetPostNSFW"
                      className="text-warning"
                      color="warning"
                      onClick={() =>
                        setConfirmAdminAction({
                          open: true,
                          title: 'Set post as NSFW',
                          action: handleAdminSetPostNsfw,
                        })
                      }
                      startContent={<Nsfw2 className="h-4 w-4" />}
                    >
                      Mark as NSFW
                    </DropdownItem>
                  )}
                  {user?.isAdmin && !isSelf && (
                    <DropdownItem
                      key="adminDeletePost"
                      className="text-warning"
                      color="warning"
                      onClick={() =>
                        setConfirmAdminAction({
                          open: true,
                          title: `Delete ${intPost?.user.mention}'s post`,
                          action: handleAdminDeletePost,
                        })
                      }
                      startContent={<XMarkIcon className="h-4 w-4" />}
                    >
                      Delete Post
                    </DropdownItem>
                  )}
                  {user?.isAdmin && !isSelf && (
                    <DropdownItem
                      key="adminBanUser"
                      className="text-warning"
                      color="warning"
                      hidden={!user?.isAdmin || isSelf}
                      onClick={() =>
                        setConfirmAdminAction({
                          open: true,
                          title: `Permanently Ban ${intPost?.user.mention}`,
                          action: handleAdminBanUser,
                        })
                      }
                      startContent={<GiThorHammer className="h-4 w-4" />}
                    >
                      Ban User
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            )}
          </CardHeader>
          <CardBody className='overflow-hidden px-0 py-0 text-default-500 text-small'>
            {intPost?.title && (
              <div className='mx-3 mb-3'>
                <p className='max-h-[65px] min-h-[20px] overflow-y-auto font-semibold text-default-600 leading-4'>
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
                key={'photo'}
                title={
                  <div className="flex items-center">
                    <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== 'photo' })} />
                  </div>
                }
              >
                <div
                  className={clsx('relative h-full w-full cursor-pointer overflow-y-hidden [&>div]:hover:flex', {
                    'max-h-[598px]': !isSingle,
                    'max-h-[400px] overflow-y-scroll': isSingle,
                  })}
                >
                  {revealed && (
                    <>
                      <div className='pointer-events-none absolute top-2 right-2 z-10 hidden'>
                        <Button size="sm" isIconOnly variant="light">
                          <ArrowsPointingOutIcon className='h-8 w-8 stroke-neutral-100/90' />
                        </Button>
                      </div>
                      {intPost.nsfw && (
                        <div className='absolute top-12 right-2 z-10 hidden'>
                          <Button size="sm" isIconOnly variant="flat" onClick={() => setRevealed(false)}>
                            <EyeSlashIcon className='h-6 w-6 text-neutral-100/80 opacity-80' />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                  {!revealed && (
                    <div className='-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 z-10 flex transform flex-col items-center gap-2'>
                      <Button size="lg" isIconOnly variant="flat" className="">
                        <Nsfw2 className='h-8 w-8 stroke-neutral-100/10 opacity-70' />
                      </Button>
                      <div className='rounded-2xl bg-default/40 p-1 px-3 font-bold text-md text-neutral-100/70 '>
                        View NSFW Content
                      </div>
                    </div>
                  )}
                  <LazyLoadImage
                    placeholderSrc={postImageLowq}
                    effect="blur"
                    src={postImage}
                    width={intPost?.image?.width}
                    height={intPost?.image?.height}
                    className={clsx({ 'blur-lg': intPost.nsfw && !revealed })}
                    onClick={revealed ? () => onOpenModal(postImage) : () => setRevealed(true)}
                    wrapperProps={{
                      style: { transitionDuration: '0.6s' },
                    }}
                  />
                </div>
              </Tab>
              {hasLocationData && (
                <Tab
                  key={'map'}
                  title={
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== 'map' })} />
                    </div>
                  }
                >
                  <div className='h-[365px] min-w-[284px] overflow-hidden'>
                    <SnapMap
                      markers={[{ lat: intPost?.image?.latitude, lng: intPost?.image?.longitude }]}
                      maxZoom={17} minZoom={3} defaultZoom={16}
                    />
                  </div>
                </Tab>
              )}
              <Tab
                key={'comments'}
                title={
                  <div className="flex items-center space-x-2">
                    {selectedTab !== 'comments' ? (
                      <ChatBubbleLeftRightIcon className='h-6 w-6 stroke-neutral-200' />
                    ) : (
                      <ChatBubbleLeftRightIconSolid className='h-6 w-6' />
                    )}
                    {intPost.commentCount > 0 && (
                      <Chip size="sm" variant="faded">
                        {intPost.commentCount}
                      </Chip>
                    )}
                  </div>
                }
              >
                <div className='flex h-[365px] min-w-[284px] flex-col px-2'>
                  {intPost.postComments.length > 0 && (
                    <div ref={commentsWrapperRef} className="h-full overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {intPost.postComments.map((comment) => (
                          <Comment key={`post-${post.id}-comment-${comment.id}`} comment={comment} user={user} />
                        ))}
                      </div>
                    </div>
                  )}
                  {intPost.postComments.length === 0 && (
                    <div className='flex h-full flex-col justify-center align-middle'>
                      <h2 className='text-center font-bold text-blue-600 text-lg'>
                        {isAuthenticated ? 'Be the first to comment' : 'no comments'}
                      </h2>
                    </div>
                  )}
                  {isAuthenticated && <WritePostComment postId={intPost.id} onSubmit={reload} />}
                </div>
              </Tab>
            </Tabs>
          </CardBody>
          <CardFooter className="gap-3 pt-0">
            <div className='flex w-full flex-row items-center justify-center gap-4 px-2'>
              <div className="flex gap-1 ">
                <p className=' cursor-pointer text-default-500 text-small' onClick={handleLike}>
                  {liked ? (
                    <HeartIconSolid className='h-5 w-5 fill-red-500' />
                  ) : (
                    <HeartIconOutlined className='h-5 w-5 stroke-default-600' />
                  )}
                </p>
                {intPost?.likeCount > 0 && (
                  <p
                    className='cursor-pointer font-semibold text-default-700 text-small hover:text-blue-500'
                    onClick={() => navigate(`/post/${intPost.id}/likes`)}
                  >
                    {intPost?.likeCount}
                    {intPost?.likeCount === 1 ? ' like' : ' likes'}
                  </p>
                )}
              </div>
              <div className="flex-grow" />
              <div className="flex gap-2">
                <p className='cursor-default font-semibold text-default-600 text-small leading-none'>{timeAgo}</p>
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
  },
)

export default Post
