import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  Tooltip,
  useDisclosure,
} from '@heroui/react'
import React, { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import CreatePost from '../Post/CreatePost'
import UploadImage from '../Post/UploadImage'

import { BellIcon, HomeIcon } from '@heroicons/react/24/outline'
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SquaresPlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../../assets/logo/dark/Logo'
import { getAssetUrl } from '../../common/utils'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import CreateCollection from '../Collection/CreateCollection'
import NotificationMenu from '../Notification/NotificationMenu'

function Footer({ handleOnHome, handleOnSubmit, noProfile, hideProfileSelect, user, isAuthenticated }) {
  const [uploadedImageData, setUploadedImageData] = useState()
  const [exifOnly, setExifOnly] = useState(false)
  const notifications = useNotifications()
  const captureDeviceSelect = useDisclosure()
  const [postChoiceOpen, setPostChoiceOpen] = useState(false)
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false)

  const navigate = useNavigate()

  const { logout } = useAuth()

  async function handleNewPost() {
    if (navigator?.geolocation) {
      const { state } = await navigator.permissions.query({ name: 'geolocation' })
      if (state === 'granted' || state === 'prompt') {
        captureDeviceSelect.onOpen()
      } else {
        toast.warning(
          'GPS location is required to post. Please enable location data in your browsers permission settings and try again.',
        )
      }
    } else {
      setExifOnly(true)
      captureDeviceSelect.onOpen()
    }
  }
  async function handlePostChoice() {
    setPostChoiceOpen(true)
  }

  return (
    <>
      <Modal
        className='dark m-0 rounded-b-none bg-transparent/90 p-0'
        isOpen={captureDeviceSelect.isOpen}
        onClose={captureDeviceSelect.onClose}
        placement="bottom"
        backdrop="transparent"
        hideCloseButton
      >
        <ModalContent className='flex flex-row items-center justify-center gap-4 pt-8 pb-8 sm:m-0'>
          <UploadImage onImageUploaded={setUploadedImageData} mode="camera" exifOnly={exifOnly} />
          <UploadImage onImageUploaded={setUploadedImageData} exifOnly={exifOnly} />
        </ModalContent>
      </Modal>

      <Modal
        className='m-0 rounded-b-none bg-transparent/90 p-0'
        isOpen={postChoiceOpen}
        onClose={() => setPostChoiceOpen(false)}
        placement="bottom"
        backdrop="transparent"
        hideCloseButton
      >
        <ModalContent className='flex flex-collumn items-center justify-center gap-4 pt-8 pb-8 sm:m-0 '>
          <Button
            color="primary"
            variant="shadow"
            startContent={<PlusIcon className="h-6 w-6" />}
            onClick={() => {
              setPostChoiceOpen(false)
              handleNewPost()
            }}
          >
            New Post
            <div className="mr-[26px]" />
          </Button>
          <Button
            color="primary"
            variant="shadow"
            startContent={<SquaresPlusIcon className="h-6 w-6" />}
            onClick={() => {
              setPostChoiceOpen(false)
              setCreateCollectionOpen(true)
            }}
          >
            New Collection
          </Button>
        </ModalContent>
      </Modal>

      <CreatePost
        imageData={uploadedImageData}
        onOpen={captureDeviceSelect.onClose}
        onCancel={() => setUploadedImageData(null)}
        onSubmitted={(post) => {
          navigate('/feed')
          handleOnSubmit(post)
        }}
      />
      {isAuthenticated && (
        <CreateCollection
          open={createCollectionOpen}
          onClose={() => setCreateCollectionOpen(false)}
          onSubmitted={() => navigate('/profile')}
        />
      )}

      <footer
        onClick={(e) => e.stopPropagation()}
        className='sticky inset-x-0 bottom-0 z-10 mt-auto flex h-auto w-full items-center justify-center border-divider border-t bg-background py-1.5'
      >
        <div className='flex w-full max-w-[1024px] items-center justify-between px-6'>
          <Button isIconOnly size="sm" color="default" variant="light" aria-label="new post" onClick={handleOnHome}>
            <HomeIcon className="h-8 w-8" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            color="default"
            variant="light"
            aria-label="search users"
            onClick={() => (isAuthenticated ? navigate('/search') : toast.info('You must be logged in to do that.'))}
          >
            <MagnifyingGlassIcon className="h-8 w-8" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            color="default"
            variant="light"
            className="w-11 "
            aria-label="new post"
            onClick={(e) => {
              if (isAuthenticated) {
                e.stopPropagation()
                // handleNewPost()
                handlePostChoice()
              } else {
                toast.info('You must be logged in to do that.')
              }
            }}
          >
            <Logo className="h-11" />
          </Button>
          <Badge
            content={notifications.unreadCount}
            isInvisible={notifications.unreadCount === 0}
            size="sm"
            color="danger"
          >
            <NotificationMenu
              trigger={
                <Button isIconOnly size="sm" variant="light" className="cursor-pointer">
                  <BellIcon className="h-8 w-8" />
                </Button>
              }
              onMenuClosed={() => notifications.read()}
              notifications={notifications.notifications}
            />
          </Badge>

          {!noProfile ? (
            <Dropdown backdrop="blur" placement="bottom-end" className='dark bg-black text-foreground'>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className='h-7 w-7 transition-transform'
                  color={user?.image ? 'primary' : 'default'}
                  src={user?.image ? getAssetUrl() + user.image.reference : ''}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="faded">
                <DropdownItem
                  key="signin-info"
                  isReadOnly
                  className="h-14 gap-2"
                  textValue={`Signed in as ${user?.email}`}
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold text-primary-500">{user?.email}</p>
                </DropdownItem>
                {!hideProfileSelect && (
                  <DropdownItem
                    key="profile"
                    onClick={() => navigate('/profile')}
                    startContent={<UserIcon className='pointer-events-none h-5 w-5 flex-shrink-0' />}
                  >
                    My Profile
                  </DropdownItem>
                )}
                <DropdownItem
                  key="feedback"
                  href="https://github.com/ShaneIsrael/Snapsmaps"
                  startContent={<FaGithub className='h-5 w-5' />}
                >
                  Project Home
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={logout}
                  startContent={<ArrowLeftEndOnRectangleIcon className='pointer-events-none h-5 w-5 flex-shrink-0' />}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Tooltip
              color={isAuthenticated ? 'danger' : 'primary'}
              content={isAuthenticated ? 'Logout' : 'Login'}
              className="capitalize"
            >
              {isAuthenticated ? (
                <Button isIconOnly size="sm" variant="light" className="cursor-pointer" onClick={logout}>
                  <ArrowLeftEndOnRectangleIcon className="fill-red-600" width="32" height="32" />
                </Button>
              ) : (
                <Button isIconOnly size="sm" variant="light" className="cursor-pointer" onClick={() => navigate('/')}>
                  <ArrowRightEndOnRectangleIcon width="32" height="32" />
                </Button>
              )}
            </Tooltip>
          )}
        </div>
      </footer>
    </>
  )
}

export default Footer
