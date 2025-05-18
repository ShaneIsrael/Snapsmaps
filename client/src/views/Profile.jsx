import { ArrowDownIcon, ArrowPathIcon, MapIcon, XMarkIcon } from '@heroicons/react/24/solid'
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalContent,
  Skeleton,
  Textarea,
  useDisclosure,
} from '@heroui/react'
import clsx from 'clsx'
import React, { useState, useCallback, useEffect } from 'react'
import { Collapse } from 'react-collapse'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate, useParams } from 'react-router-dom'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { toast } from 'sonner'
import Nsfw2 from '../assets/icons/Nsfw2'
import { getAssetUrl, getSessionUser } from '../common/utils'
import CollectionItem from '../components/Collection/CollectionItem'
import ImageCrop from '../components/Cropper/ImageCrop'
import Appbar from '../components/Layout/Appbar'
import Footer from '../components/Layout/Footer'
import PageLayout from '../components/Layout/PageLayout'
import SnapMap from '../components/Map/SnapMap'
import Post from '../components/Post/Post'
import ProfilePageSkeleton from '../components/Skeletons/ProfilePageSkeleton'
import { useAuthed } from '../hooks/useAuthed'
import ImageCropProvider from '../providers/ImageCropProvider'
import { PostService, ProfileService } from '../services'

const Profile = React.memo(({ isSelfProfile, isMention }) => {
  const postModal = useDisclosure()
  const imageModal = useDisclosure()
  const [isSelf, setIsSelf] = useState(isSelfProfile)
  const [isFollowed, setIsFollowed] = useState(false)
  const [post, setPost] = useState()
  const [selectedPostTab, setSelectedPostTab] = useState('photo')
  const [postHistory, setPostHistory] = useState([])
  const [collections, setCollections] = useState([])
  const [modalImage, setModalImage] = useState()
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const [mapOpened, setMapOpened] = useState(true)
  const [postHistoryHoverId, setPostHistoryHoverId] = useState(null)

  const { mention, postId, tabId } = useParams()
  const { isAuthenticated } = useAuthed()

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

  const fetchHistory = async (mention) => {
    try {
      const history = mention
        ? (await ProfileService.getMentionPostHistory(mention)).data
        : (await ProfileService.getPostHistory()).data

      setPostHistory(history)
    } catch (err) {
      console.error(err)
    }
  }
  const fetchCollections = async (mention) => {
    try {
      const response = mention
        ? (await ProfileService.getMentionCollections(mention)).data
        : (await ProfileService.getCollections()).data

      setCollections(response)
    } catch (err) {
      console.error(err)
    }
  }

  const fetch = async () => {
    try {
      let profile
      if (!mention) {
        profile = (await ProfileService.getAuthedProfile()).data
        await fetchHistory()
        await fetchCollections()
        setUpdatedProfileDetails(profile)
      } else {
        try {
          profile = (await ProfileService.getProfileByMention(mention)).data
          await fetchHistory(mention)
          await fetchCollections(mention)
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
  }

  const handleUpdateProfile = async () => {
    try {
      setSaving(true)
      await ProfileService.update(updatedProfileDetails)
      fetch()
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
    setEditMode(false)
  }

  const handleFollow = async () => {
    try {
      await ProfileService.follow(mention)
      fetch()
    } catch (err) {
      if (err.response?.data) {
        toast.error(err.response?.data)
      }
    }
  }

  const handleUnfollow = async () => {
    try {
      await ProfileService.unfollow(mention)
      fetch()
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data)
      }
    }
  }

  useEffect(() => {
    if (post && postId && !postModal.isOpen) {
      navigate(`/user/${post.user.mention}`)
    }
  }, [postModal.isOpen])

  useEffect(() => {
    fetch()
  }, [mention])

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
            pageName={<Skeleton className="h-6 w-28 rounded-md" />}
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
                      <XMarkIcon className="h-7 w-7 text-neutral-50/90" />
                    </Button>
                  </div>
                  <TransformWrapper defaultScale={1}>
                    <TransformComponent>
                      <div className="flex h-screen w-screen justify-center">
                        <img className="object-contain" src={modalImage} alt="post media" />
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
            placement="top"
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
              className="-translate-x-1/2 pointer-events-none absolute bottom-4 left-1/2 z-50 opacity-50"
            >
              <XMarkIcon />
            </Button>
          </Modal>

          <div className="mx-0 flex-grow overflow-y-auto pt-20 pb-[50px]">
            <div className="flex max-w-[500px] items-start justify-start gap-5 px-4">
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
                    className="h-20 w-20 text-large"
                    color={isSelf ? 'primary' : 'default'}
                  />
                )}

                {!isSelf &&
                  isAuthenticated &&
                  (isFollowed ? (
                    <Dropdown className="dark w-[100px] min-w-0 p-[1px]">
                      <DropdownTrigger>
                        <Button size="sm" color="default" className="font-bold" variant="bordered">
                          following
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="following dropdown" color="default" variant="flat">
                        <DropdownItem
                          key="unfollow"
                          className="text-center text-danger"
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
                    className={isFollowed ? 'w-[80px] border-default-200 bg-transparent text-foreground' : 'w-[80px]'}
                    color={editMode ? 'primary' : 'default'}
                    radius="sm"
                    size="sm"
                    variant={editMode ? 'bordered' : 'solid'}
                    onClick={editMode ? handleUpdateProfile : () => setEditMode(true)}
                    disabled={saving}
                  >
                    {saving && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
                    {editMode ? (saving ? 'Saving...' : 'Save') : 'Edit'}
                  </Button>
                )}
              </div>
              <div className="flex w-full flex-col items-start justify-center gap-4">
                <div className="h-[125px] w-full">
                  {!editMode ? (
                    <>
                      <h4 className="font-semibold text-2xl text-default-600 leading-none">{profile?.displayName}</h4>
                      <h5 className="text-blue-400 text-md tracking-tight">@{profile?.mention}</h5>
                      <p className="mt-2 whitespace-pre-line text-default-600 text-small tracking-normal">
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
                            displayName: value.slice(0, import.meta.env.VITE_MAX_DISPLAY_NAME_LENGTH),
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
                            mention: value.slice(0, import.meta.env.VITE_MAX_MENTION_LENGTH),
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
                            bio: value.slice(0, import.meta.env.VITE_MAX_PROFILE_BIO_LENGTH),
                          }))
                        }
                        rows={2}
                        maxRows={2}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-5">
                  <div className="flex justify-center gap-5">
                    <div className="flex flex-col items-center">
                      <h2 className="font-extrabold text-default-600 text-xl">{postHistory.length}</h2>
                      <span className="font-semibold text-default-600 text-md">posts</span>
                    </div>
                    <div
                      className="flex cursor-pointer flex-col items-center [&>*]:hover:text-blue-500"
                      onClick={() =>
                        navigate(mention ? `/user/${mention}/follows#followers` : '/profile/follows#followers')
                      }
                    >
                      <h2 className="font-extrabold text-default-600 text-xl">{profile?.followersCount}</h2>
                      <span className="font-semibold text-default-600 text-md">followers</span>
                    </div>
                    <div
                      className="flex cursor-pointer flex-col items-center [&>*]:hover:text-blue-500"
                      onClick={() =>
                        navigate(mention ? `/user/${mention}/follows#following` : '/profile/follows#following')
                      }
                    >
                      <h2 className="font-extrabold text-default-600 text-xl">{profile?.followingCount}</h2>
                      <span className="font-semibold text-default-600 text-md">following</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {collections && collections.length > 0 && <Divider className="my-5" />}
            <div className="flex flex-wrap justify-center gap-2">
              {collections.map((collection) => (
                <CollectionItem
                  key={`collection-${collection.id}`}
                  collection={collection}
                  isAuthenticated={isAuthenticated}
                  isSelf={isSelf}
                  onClick={() =>
                    isMention
                      ? navigate(`/user/${mention}/collection/${collection.id}`)
                      : navigate(`/profile/collection/${collection.id}`)
                  }
                />
              ))}
            </div>
            <Divider className="mt-5 mb-5" />

            <div className="flex flex-wrap justify-center gap-1">
              {postHistory.map((post) => (
                <div
                  key={`post-history-${post.id}`}
                  className="relative cursor-pointer overflow-hidden"
                  onMouseEnter={() => setPostHistoryHoverId(post.id)}
                  onMouseLeave={() => setPostHistoryHoverId(null)}
                >
                  {post.nsfw && (
                    <div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 z-20 flex transform flex-col items-center gap-2">
                      <Button size="md" isIconOnly variant="flat" className="">
                        <Nsfw2 className="h-6 w-6 stroke-neutral-100/10 opacity-70" />
                      </Button>
                    </div>
                  )}
                  <LazyLoadImage
                    alt="a history image"
                    effect="blur"
                    src={`${getAssetUrl()}/thumb/120x120/${post.image.reference.split('/')[2]}`}
                    className={clsx('h-[120px] w-[120px] rounded-none object-cover', { 'blur-sm': post.nsfw })}
                    onClick={() => handleOpenModal(post.id)}
                  />
                </div>
              ))}
            </div>
            <Divider className="mt-5 mb-2" />
            {postHistory.length > 0 && (
              <>
                <div className="flex w-full justify-center">
                  <Button
                    isIconOnly
                    variant="faded"
                    color="default"
                    size="md"
                    aria-label="Open Map"
                    onClick={() => setMapOpened((prev) => !prev)}
                    className={clsx('-mb-5 z-10 rotate-180', { 'rotate-0 ': mapOpened })}
                  >
                    <ArrowDownIcon className="h-7 w-7" />
                  </Button>
                </div>
                <Collapse isOpened={mapOpened}>
                  <div className="flex h-[500px] flex-row">
                    <SnapMap
                      mapClassName="h-[500px] w-full"
                      markers={postHistory
                        .filter((post) => post.image.latitude && post.image.longitude)
                        .map((post) => ({
                          onClick: () => handleOpenModal(post.id),
                          lat: post.image.latitude,
                          lng: post.image.longitude,
                          highlight: post.id === postHistoryHoverId,
                        }))}
                    />
                  </div>
                </Collapse>
                {/* <Divider className={clsx('my-5', { 'mt-7': !mapOpened })} /> */}
              </>
            )}
          </div>
        </>
      )}
    </PageLayout>
  )
})

export default Profile
