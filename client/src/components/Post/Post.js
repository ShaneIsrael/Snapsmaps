import React, { useCallback, useEffect, useRef } from 'react'
import GoogleMapReact from 'google-map-react'
import clsx from 'clsx'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
  Divider,
  Badge,
  Chip,
} from '@nextui-org/react'
import Heart from '../../assets/icons/Heart'
import { GoogleMapDarkMode } from '../../common/themes'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import ChatIcon from '../../assets/icons/ChatIcon'
import Comment from '../Comment/Comment'
import { getAssetUrl, getSessionUser, getUrl } from '../../common/utils'
import { CommentService, LikeService, PostService } from '../../services'
import { formatDistanceStrict } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuthed } from '../../hooks/useAuthed'
import { HandThumbUpIcon, ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid } from '@heroicons/react/24/solid'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

function Post({ post, isSelf, defaultFollowed, defaultLiked, onOpenModal, width = '90%' }) {
  const [intPost, setIntPost] = React.useState(post)
  const [isFollowed, setIsFollowed] = React.useState(defaultFollowed)
  const [selectedTab, setSelectedTab] = React.useState('photo')
  const [liked, setLiked] = React.useState(false)
  const [comment, setComment] = React.useState('')
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthed()

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

  const handleCommentKeydown = (e) => {
    if (e.key === 'Enter') {
      if (comment) {
        submitComment()
      }
    }
  }

  const renderMarkers = (map, maps) => {
    new maps.Marker({
      position: { lat: intPost?.image.latitude, lng: intPost?.image.longitude },
      map,
    })
  }

  const getMapOptions = (maps) => {
    return {
      streetViewControl: true,
      scaleControl: true,
      fullscreenControl: true,
      styles: [
        ...GoogleMapDarkMode,
        {
          featureType: 'poi.business',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
      gestureHandling: 'greedy',
      disableDoubleClickZoom: true,
      minZoom: 0,
      maxZoom: 25,

      mapTypeControl: false,
      mapTypeId: maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: maps.ControlPosition.TOP_LEFT,
        mapTypeIds: [maps.MapTypeId.ROADMAP, maps.MapTypeId.SATELLITE],
      },
      zoomControl: false,
      clickableIcons: false,
    }
  }

  const hasProfileImage = !!intPost?.user?.image
  const timeAgo = formatDistanceStrict(new Date(intPost.createdAt), new Date(), { addSuffix: true })

  return (
    <>
      <Card className="w-full">
        <CardHeader className="justify-between">
          <div className="flex gap-3">
            <Avatar
              isBordered
              color={isSelf ? 'primary' : 'default'}
              radius="full"
              size="md"
              className="cursor-pointer"
              onClick={() => navigate(`/user/${intPost?.user?.mention}`)}
              src={hasProfileImage ? getAssetUrl() + intPost?.user?.image?.reference : ''}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4
                className={clsx(
                  'text-md font-semibold leading-none text-default-600 cursor-pointer hover:text-neutral-50',
                  {
                    'text-primary-500': isSelf,
                  },
                )}
                onClick={() => navigate(`/user/${intPost?.user?.mention}`)}
              >
                {intPost?.user?.displayName}
              </h4>

              <h5 className="text-small font-semibold tracking-tight text-default-400">@{intPost?.user?.mention}</h5>
            </div>
          </div>
          {isAuthenticated && !isSelf && (
            <Button
              className={isFollowed ? 'bg-transparent text-foreground border-default-200' : ''}
              color="primary"
              radius="full"
              size="sm"
              variant={isFollowed ? 'bordered' : 'solid'}
              onClick={() => setIsFollowed(!isFollowed)}
            >
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-500 font-semibold overflow-y-hidden rounded-b-2xl">
          <p className="mb-2">{intPost?.title}</p>
          <Tabs
            aria-label="post tabs"
            color="primary"
            radius="full"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            className="block"
            autoFocus={false}
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
              <div className="flex justify-center max-h-[350px] rounded-2xl">
                <img
                  className="object-contain cursor-pointer"
                  src={postImage}
                  onClick={() => onOpenModal(postImage)}
                  alt="a post image"
                />
              </div>
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
              <div className="overflow-hidden rounded-2xl h-[350px]">
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyA_PPhb-5jcZsLPcTdjoBBvF8CzvIbg4RE' }}
                  defaultCenter={{ lat: intPost?.image?.latitude, lng: intPost?.image?.longitude }}
                  defaultZoom={14}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
                  options={getMapOptions}
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
              <div className="h-[350px] flex flex-col">
                <div className="overflow-y-scroll">
                  <div className="flex flex-col gap-2 scroll-">
                    {intPost.postComments.map((comment) => (
                      <Comment key={`post-${post.id}-comment-${comment.id}`} comment={comment} />
                    ))}
                  </div>
                </div>

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
    </>
  )
}

export default Post
