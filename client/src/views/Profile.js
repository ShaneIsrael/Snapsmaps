import {
  Button,
  Image,
  Avatar,
  Divider,
  useDisclosure,
  Modal,
  ModalContent,
  Input,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from '@nextui-org/react'
import React, { useState, useCallback, useEffect } from 'react'
import Appbar from '../components/Layout/Appbar'
import Post from '../components/Post/Post'
import { useNavigate, useParams } from 'react-router-dom'
import { getAssetUrl, getSessionUser } from '../common/utils'
import { PostService, ProfileService } from '../services'
import ImageCropProvider from '../providers/ImageCropProvider'
import ImageCrop from '../components/Cropper/ImageCrop'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid'
import SnapMap from '../components/Map/SnapMap'
import Footer from '../components/Layout/Footer'
import { toast } from 'sonner'
import ProfilePageSkeleton from '../components/Skeletons/ProfilePageSkeleton'
import PageLayout from '../components/Layout/PageLayout'
import clsx from 'clsx'
import Nsfw2 from '../assets/icons/Nsfw2'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

const Profile = React.memo(({ isSelfProfile, isMention }) => {
  const postModal = useDisclosure()
  const imageModal = useDisclosure()
  const [isSelf, setIsSelf] = useState(isSelfProfile)
  const [isFollowed, setIsFollowed] = useState(false)
  const [post, setPost] = useState()
  const [selectedPostTab, setSelectedPostTab] = useState('photo')
  const [postHistory, setPostHistory] = useState([])
  const [modalImage, setModalImage] = useState()
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const [postHistoryHoverId, setPostHistoryHoverId] = useState(null)

  const { mention, postId, tabId } = useParams()

  const navigate = useNavigate()

  const [profile, setProfile] = useState()

  const [updatedProfileDetails, setUpdatedProfileDetails] = useState({
    displayName: '',
    mention: '',
    bio: '',
    image: '',
  })

  const handleOpenModal = useCallback(async (id, tab) => {
    try {
      const post = (await PostService.get(id)).data
      setPost(post)
      setSelectedPostTab(tab || 'photo')
      postModal.onOpen()
    } catch (err) {
      toast.error(err.response?.data)
    }
  }, [])

  const handleOpenImageModal = useCallback((image) => {
    setModalImage(image)
    imageModal.onOpen()
  }, [])

  const fetchHistory = useCallback(async (mention) => {
    try {
      const history = mention
        ? (await ProfileService.getMentionPostHistory(mention)).data
        : (await ProfileService.getPostHistory()).data

      setPostHistory(history)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const fetch = useCallback(async () => {
    try {
      let profile
      if (!mention) {
        profile = (await ProfileService.getAuthedProfile()).data
        await fetchHistory()
        setUpdatedProfileDetails(profile)
      } else {
        try {
          profile = (await ProfileService.getProfileByMention(mention)).data
          await fetchHistory(mention)
        } catch (err) {
          toast.error(err.response.data)
          navigate('/feed')
        }
      }
      setIsFollowed(profile.isFollowed)
      setProfile(profile)
    } catch (err) {
      console.error(err)
    }
    setFirstLoad(false)
  }, [mention, fetchHistory, navigate])

  const handleUpdateProfile = useCallback(async () => {
    try {
      setSaving(true)
      await ProfileService.update(updatedProfileDetails)
      fetch()
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
    setEditMode(false)
  }, [updatedProfileDetails, fetch])

  const handleFollow = useCallback(async () => {
    try {
      await ProfileService.follow(mention)
      fetch()
    } catch (err) {
      if (err.response?.data) {
        toast.error(err.response?.data)
      }
    }
  }, [mention, fetch])

  const handleUnfollow = useCallback(async () => {
    try {
      await ProfileService.unfollow(mention)
      fetch()
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data)
      }
    }
  }, [mention, fetch])

  useEffect(() => {
    if (post && postId && !postModal.isOpen) {
      navigate(`/user/${post.user.mention}`)
    }
  }, [postModal.isOpen])

  useEffect(() => {
    fetch()
  }, [mention, fetch])

  useEffect(() => {
    async function openPost() {
      if (postId) {
        await handleOpenModal(postId, tabId)
      }
    }
    openPost()
  }, [postId, tabId, handleOpenModal])

  const sessionUser = getSessionUser()

  useEffect(() => {
    if (isMention && sessionUser?.mention === mention) {
      setIsSelf(true)
    }
  }, [isMention, mention, sessionUser?.mention])

  if (firstLoad) {
    return (
      <ProfilePageSkeleton
        appbar={
          <Appbar
            noProfile
            backButton={() => navigate('/feed')}
            pageName={<Skeleton className="rounded-md w-28 h-6" />}
          />
        }
        footer={
          <Footer
            handleOnHome={() => navigate('/feed')}
            handleOnSubmit={() => navigate('/feed')}
            noProfile={!sessionUser}
            hideProfileSelect
          />
        }
      />
    )
  }

  return (
    <PageLayout
      noProfile
      backButton={() => navigate('/feed')}
      pageName={profile?.mention}
      hideProfileSelect={!mention || mention === sessionUser?.mention}
    >
      {({ user, isAuthenticated }) => (
        <>
          <Modal
            isOpen={imageModal.isOpen}
            onClose={imageModal.onClose}
            size="full"
            placement="center"
            backdrop="blur"
            hideCloseButton
          >
            <ModalContent className="bg-opacity-0">
              {(onClose) => (
                <>
                  <div className="relevant absolute top-2 right-2 z-10">
                    <Button size="md" variant="flat" isIconOnly onClick={onClose}>
                      <XMarkIcon className="text-neutral-50/90  h-7 w-7" />
                    </Button>
                  </div>
                  <TransformWrapper defaultScale={1}>
                    <TransformComponent>
                      <div className="w-screen h-screen flex justify-center">
                        <img className="object-contain" src={modalImage} alt="a post image" />
                      </div>
                    </TransformComponent>
                  </TransformWrapper>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            className="dark m-0"
            isOpen={postModal.isOpen}
            onClose={postModal.onClose}
            placement="center"
            backdrop="blur"
            hideCloseButton
          >
            <ModalContent className="overflow-hidden">
              {(onClose) => (
                <Post
                  isSelf={isSelf}
                  post={post}
                  defaultSelectedTab={selectedPostTab}
                  defaultLiked={post.postLikes?.length > 0}
                  onOpenModal={handleOpenImageModal}
                  isSingle
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </ModalContent>
            <Button
              isIconOnly
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-50"
            >
              <XMarkIcon />
            </Button>
          </Modal>

          <div className="flex-grow mx-0 pb-[50px] pt-20 overflow-y-auto">
            <div className="flex px-4 gap-5 max-w-[500px] justify-start items-start">
              <div className="flex flex-col gap-4">
                {editMode ? (
                  <ImageCropProvider>
                    <ImageCrop
                      onDone={(image) => setUpdatedProfileDetails((prev) => ({ ...prev, image, includesImage: true }))}
                    />
                  </ImageCropProvider>
                ) : (
                  <Avatar
                    src={profile?.image ? getAssetUrl() + profile?.image : ''}
                    isBordered
                    className="w-20 h-20 text-large"
                    color={isSelf ? 'primary' : 'default'}
                  />
                )}

                {!isSelf &&
                  (isFollowed ? (
                    <Dropdown className="dark min-w-0 p-[1px] w-[100px]">
                      <DropdownTrigger>
                        <Button size="sm" color="default" className="font-bold" variant="bordered">
                          following
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="following dropdown" color="default" variant="flat">
                        <DropdownItem
                          key="unfollow"
                          className="text-danger text-center"
                          color="danger"
                          onClick={handleUnfollow}
                        >
                          Unfollow
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  ) : (
                    <Button
                      color="primary"
                      radius="sm"
                      size="sm"
                      className="font-bold"
                      variant="solid"
                      onClick={handleFollow}
                    >
                      follow
                    </Button>
                  ))}
                {isSelf && (
                  <Button
                    className={isFollowed ? 'bg-transparent text-foreground border-default-200 w-[80px]' : 'w-[80px]'}
                    color={editMode ? 'primary' : 'default'}
                    radius="sm"
                    size="sm"
                    variant={editMode ? 'bordered' : 'solid'}
                    onClick={editMode ? handleUpdateProfile : () => setEditMode(true)}
                    disabled={saving}
                  >
                    {saving && <ArrowPathIcon className="animate-spin w-4 h-4" />}
                    {editMode ? (saving ? 'Saving...' : 'Save') : 'Edit'}
                  </Button>
                )}
              </div>
              <div className="w-full flex flex-col gap-4 items-start justify-center">
                <div className="h-[125px] w-full">
                  {!editMode ? (
                    <>
                      <h4 className="text-2xl font-semibold leading-none text-default-600">{profile?.displayName}</h4>
                      <h5 className="text-md tracking-tight text-blue-400">@{profile?.mention}</h5>
                      <p className="text-small tracking-normal text-default-600 mt-2 whitespace-pre-line">
                        {profile?.bio}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Input
                        type="text"
                        size="md"
                        variant="bordered"
                        placeholder="Name"
                        value={updatedProfileDetails?.displayName}
                        onValueChange={(value) =>
                          setUpdatedProfileDetails((prev) => ({
                            ...prev,
                            displayName: value.slice(0, process.env.REACT_APP_MAX_DISPLAY_NAME_LENGTH),
                          }))
                        }
                        className="w-full"
                      />
                      <Input
                        type="text"
                        size="sm"
                        variant="bordered"
                        placeholder="@mention"
                        value={updatedProfileDetails?.mention}
                        onValueChange={(value) =>
                          setUpdatedProfileDetails((prev) => ({
                            ...prev,
                            mention: value.slice(0, process.env.REACT_APP_MAX_MENTION_LENGTH),
                          }))
                        }
                        className="w-full"
                        isDisabled
                      />
                      <Textarea
                        variant="bordered"
                        placeholder="Bio"
                        value={updatedProfileDetails?.bio}
                        onValueChange={(value) =>
                          setUpdatedProfileDetails((prev) => ({
                            ...prev,
                            bio: value.slice(0, process.env.REACT_APP_MAX_PROFILE_BIO_LENGTH),
                          }))
                        }
                        rows={2}
                        maxRows={2}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-5 items-end">
                  <div className="flex gap-5 justify-center">
                    <div className="flex flex-col items-center">
                      <h2 className="text-xl font-extrabold text-default-600">{postHistory.length}</h2>
                      <span className="text-md font-semibold text-default-600">posts</span>
                    </div>
                    <div
                      className="flex flex-col items-center cursor-pointer [&>*]:hover:text-blue-500"
                      onClick={() =>
                        navigate(mention ? `/user/${mention}/follows#followers` : '/profile/follows#followers')
                      }
                    >
                      <h2 className="text-xl font-extrabold text-default-600">{profile?.followersCount}</h2>
                      <span className="text-md font-semibold text-default-600">followers</span>
                    </div>
                    <div
                      className="flex flex-col items-center cursor-pointer [&>*]:hover:text-blue-500"
                      onClick={() =>
                        navigate(mention ? `/user/${mention}/follows#following` : '/profile/follows#following')
                      }
                    >
                      <h2 className="text-xl font-extrabold text-default-600">{profile?.followingCount}</h2>
                      <span className="text-md font-semibold  text-default-600">following</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Divider className="my-5" />
            <div className="flex flex-row h-64">
              {postHistory.length > 0 && (
                <SnapMap
                  markers={postHistory.map((post) => ({
                    onClick: () => handleOpenModal(post.id),
                    lat: post.image.latitude,
                    lng: post.image.longitude,
                    highlight: post.id === postHistoryHoverId,
                  }))}
                />
              )}
            </div>
            <Divider className="my-5" />
            <div className="grid grid-cols-[repeat(auto-fill,120px)] justify-center gap-1">
              {postHistory.map((post) => (
                <div
                  key={`post-history-${post.id}`}
                  className="relative cursor-pointer overflow-hidden"
                  onMouseEnter={() => setPostHistoryHoverId(post.id)}
                  onMouseLeave={() => setPostHistoryHoverId(null)}
                >
                  {post.nsfw && (
                    <div className="absolute flex flex-col items-center gap-2 pointer-events-none z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Button size="md" isIconOnly variant="flat" className="">
                        <Nsfw2 className="stroke-neutral-100/10 w-6 h-6 opacity-70" />
                      </Button>
                    </div>
                  )}
                  <Image
                    onClick={() => handleOpenModal(post.id)}
                    alt="a history image"
                    src={getAssetUrl() + post.image.reference}
                    className={clsx('w-[120px] h-[120px] object-cover rounded-none', { 'blur-sm': post.nsfw })}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </PageLayout>
  )
})

export default Profile
