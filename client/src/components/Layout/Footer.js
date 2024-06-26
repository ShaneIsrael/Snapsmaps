import React, { useEffect, useState } from 'react'
import UploadImage from '../Post/UploadImage'
import CreatePost from '../Post/CreatePost'
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
} from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getAssetUrl } from '../../common/utils'
import { BellIcon, EnvelopeIcon, HomeIcon } from '@heroicons/react/24/outline'
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { ReactComponent as Logo } from '../../assets/logo/dark/logo.svg'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationMenu from '../Notification/NotificationMenu'

function Footer({ handleOnHome, handleOnSubmit, noProfile, hideProfileSelect, user, isAuthenticated }) {
  const [uploadedImageData, setUploadedImageData] = useState()
  const [exifOnly, setExifOnly] = useState(false)
  const notifications = useNotifications()
  const captureDeviceSelect = useDisclosure()

  const navigate = useNavigate()

  const { logout } = useAuth()

  async function handleNewPost() {
    if (navigator.geolocation) {
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

  return (
    <>
      <Modal
        className="dark p-0 m-0 rounded-b-none"
        isOpen={captureDeviceSelect.isOpen}
        onClose={captureDeviceSelect.onClose}
        placement="bottom"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="flex flex-row justify-center items-center pt-8 pb-8 gap-4 sm:m-0">
          <UploadImage onImageUploaded={setUploadedImageData} mode="camera" exifOnly={exifOnly} />
          <UploadImage onImageUploaded={setUploadedImageData} exifOnly={exifOnly} />
        </ModalContent>
      </Modal>

      <CreatePost
        imageData={uploadedImageData}
        onOpen={captureDeviceSelect.onClose}
        onCancel={() => setUploadedImageData(null)}
        onSubmitted={(post) => {
          navigate('/')
          handleOnSubmit(post)
        }}
      />
      <footer
        onClick={(e) => e.stopPropagation()}
        className="sticky bottom-0 py-1.5 z-10 flex mt-auto w-full h-auto items-center justify-center inset-x-0 border-t border-divider bg-background"
      >
        <div className="flex max-w-[1024px] w-full px-6 items-center justify-between">
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
                handleNewPost()
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
            <Dropdown backdrop="blur" placement="bottom-end" className="dark text-foreground bg-black">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform w-7 h-7"
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
                    startContent={<UserIcon className="w-5 h-5 text-default-500 pointer-events-none flex-shrink-0" />}
                  >
                    My Profile
                  </DropdownItem>
                )}
                <DropdownItem
                  key="feedback"
                  href="mailto:shane@snapsmaps.com"
                  startContent={<EnvelopeIcon className="w-5 h-5 text-default-500 pointer-events-none flex-shrink-0" />}
                >
                  Send Feedback
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={logout}
                  startContent={
                    <ArrowLeftEndOnRectangleIcon className="w-5 h-5 text-default-500 pointer-events-none flex-shrink-0" />
                  }
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
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="cursor-pointer"
                  onClick={() => navigate('/login')}
                >
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
