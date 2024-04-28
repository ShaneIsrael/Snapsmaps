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
} from '@nextui-org/react'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import Comment from '../Comment/Comment'
import { downloadFile, getAssetUrl } from '../../common/utils'
import { CommentService, LikeService, PostService } from '../../services'
import { formatDistanceStrict } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import {
  HandThumbUpIcon,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid'
import { ArrowDownTrayIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import SnapMap from '../Map/SnapMap'
import { LazyLoadImage } from 'react-lazy-load-image-component'

function Post({ post, isSelf, defaultFollowed, defaultLiked, onOpenModal, isSingle, user, isAuthenticated }) {
  const [intPost, setIntPost] = React.useState(post)
  const [isFollowed, setIsFollowed] = React.useState(defaultFollowed)
  const [selectedTab, setSelectedTab] = React.useState('photo')
  const [liked, setLiked] = React.useState(false)
  const [comment, setComment] = React.useState('')
  const [deleted, setDeleted] = React.useState(false)

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

  useEffect(() => {
    async function checkIfLiked() {
      if (isAuthenticated) {
        const isLiked = (await LikeService.hasLikedPost(post?.id)).data
        setLiked(isLiked)
      }
    }
    if (user) {
      checkIfLiked()
    }
  }, [user])

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

  const handleDelete = async () => {
    try {
      await PostService.delete(post.id)
      setDeleted(true)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCommentKeydown = (e) => {
    if (e.key === 'Enter') {
      if (comment) {
        submitComment()
      }
    }
  }

  const hasProfileImage = !!intPost?.user?.image
  const timeAgo = formatDistanceStrict(new Date(intPost.createdAt), new Date(), { addSuffix: true })

  // don't show the post on the feed anymore.
  if (deleted) return false

  return (
    <>
      <Card
        className={clsx('sm:w-full  min-h-[560px] max-h-[600px] rounded-none bg-background border-none', {
          'w-screen': !isSingle,
          'sm:min-w-[450px]': !isSingle,
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

              <h5 className="text-small font-semibold tracking-tight text-default-400">@{intPost?.user?.mention}</h5>
            </div>
          </div>
          {isAuthenticated && (
            <Dropdown className="dark min-w-0 p-[1px] w-fit">
              <DropdownTrigger>
                <Button variant="light" size="sm" className="mr-2 mt-[-24px]" isIconOnly>
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="post actions">
                <DropdownItem
                  showDivider={isSelf}
                  key="download"
                  className="text-neutral-100"
                  onClick={() => downloadFile(post?.image?.reference)}
                  startContent={<ArrowDownTrayIcon className="h-4 w-4" />}
                >
                  Download image
                </DropdownItem>
                {isSelf && (
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onClick={handleDelete}
                    startContent={<XMarkIcon className="h-4 w-4" />}
                  >
                    Delete Post
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-500 overflow-hidden">
          <div className="mb-3">
            <p className="leading-4 max-h-[65px] min-h-[20px] overflow-y-auto">{intPost?.title}</p>
          </div>
          <Tabs
            aria-label="post tabs"
            color="primary"
            radius="full"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            className="block"
            variant="solid"
            autoFocus={false}
            classNames={{
              tabList: 'bg-slate-900',
              panel: 'h-[385px] pt-2',
            }}
          >
            <Tab
              key={`${post.id}-photo`}
              title={
                <div className="flex items-center space-x-2">
                  <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== `${post.id}-photo` })} />
                  <span></span>
                </div>
              }
            >
              {/* <LazyLoadImage
                onClick={() => onOpenModal(postImage)}
                className="object-cover w-full h-full rounded-2xl cursor-pointer"
                alt="a post image"
                src={postImage}
                width="100%"
                height="100%"
                effect="opacity"
                threshold={600}
                // useIntersectionObserver
              /> */}
              <img
                onClick={() => onOpenModal(postImage)}
                className="object-cover w-full h-full rounded-2xl cursor-pointer"
                alt="a post image"
                src={postImage}
              />
            </Tab>
            <Tab
              key={`${post.id}-map`}
              title={
                <div className="flex items-center space-x-2">
                  <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== `${post.id}-map` })} />
                  <span></span>
                </div>
              }
            >
              <div className="overflow-hidden rounded-2xl h-[365px] min-w-[284px]">
                <SnapMap
                  markers={[{ lat: intPost?.image?.latitude, lng: intPost?.image?.longitude }]}
                  defaultZoom={14}
                  streetViewControl
                />
              </div>
            </Tab>
            <Tab
              key={`${post.id}-comments`}
              title={
                <div className="flex items-center space-x-2">
                  {selectedTab !== `${post.id}-comments` ? (
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
              <div className="h-[365px] min-w-[284px] flex flex-col">
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
                    variant="faded"
                    labelPlacement="outside"
                    placeholder="Write..."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    maxRows={2}
                    onKeyDown={handleCommentKeydown}
                    className="max-w mt-2"
                    classNames={{
                      inputWrapper: 'rounded-lg',
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
              {intPost?.likeCount > 0 && (
                <p className="font-semibold text-default-400 text-small">{intPost?.likeCount}</p>
              )}
              <p className=" text-default-400 text-small cursor-pointer" onClick={handleLike}>
                <HandThumbUpIcon className={clsx('w-5 h-5', { 'fill-blue-500': liked, 'fill-neutral-500': !liked })} />
              </p>
            </div>
            <div className="flex-grow" />
            <div className="flex">
              <p className="text-small font-semibold leading-none text-default-400">{timeAgo}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
      {!isSingle && <Divider />}
    </>
  )
}

export default Post
