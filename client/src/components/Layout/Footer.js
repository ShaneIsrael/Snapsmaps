import React, { useEffect, useState } from 'react'
import UploadImage from '../Post/UploadImage'
import CreatePost from '../Post/CreatePost'
import {
  Avatar,
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
import PlusIcon from '../../assets/icons/PlusIcon'
import { useNavigate } from 'react-router-dom'
import { useAuthed } from '../../hooks/useAuthed'
import { useAuth } from '../../hooks/useAuth'
import { getAssetUrl } from '../../common/utils'
import { HomeIcon } from '@heroicons/react/24/outline'
import { ArrowLeftEndOnRectangleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid'

function Footer({ refreshFeed, noProfile }) {
  const [uploadedImageData, setUploadedImageData] = useState()
  const captureDeviceSelect = useDisclosure()

  const navigate = useNavigate()

  const { user, isAuthenticated } = useAuthed()

  const { logout } = useAuth()

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
        <ModalContent className="flex flex-row justify-center items-center pt-8 pb-8 gap-4">
          <UploadImage onImageUploaded={setUploadedImageData} mode="camera" />
          <UploadImage onImageUploaded={setUploadedImageData} />
        </ModalContent>
      </Modal>

      <CreatePost
        imageData={uploadedImageData}
        onOpen={captureDeviceSelect.onClose}
        onCancel={() => setUploadedImageData(null)}
        onSubmitted={() => {
          navigate('/')
          setUploadedImageData(null)
          refreshFeed()
        }}
      />
      <footer
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-0 py-1.5 flex z-40 mt-auto w-full h-auto items-center justify-center  inset-x-0 border-t border-divider backdrop-blur-lg backdrop-saturate-150 bg-background/70"
      >
        <div className="flex max-w-[1024px] w-full px-6 items-center justify-center justify-between">
          <Button
            isIconOnly
            size="sm"
            color="default"
            variant="light"
            // className="border-medium border-neutral-200 "
            aria-label="new post"
            onClick={() => {
              window.scrollTo(0, 0)
              navigate('/')
              refreshFeed()
            }}
          >
            <HomeIcon />
          </Button>
          <Button
            isIconOnly
            size="sm"
            color="default"
            variant="light"
            className="border-small border-neutral-200 h-8 "
            aria-label="new post"
            onClick={(e) => {
              e.stopPropagation()
              captureDeviceSelect.onOpen()
            }}
          >
            <PlusIcon />
          </Button>
          {!noProfile ? (
            <Dropdown backdrop="blur" placement="bottom-end" className="dark bg-neutral-900 text-foreground">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform w-7 h-7"
                  color="default"
                  size="sm"
                  src={user?.image ? getAssetUrl() + user.image : ''}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="signin-info" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="profile" onClick={() => navigate('/profile')}>
                  My Profile
                </DropdownItem>
                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logout}>
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
                <div className="cursor-pointer" onClick={logout}>
                  <ArrowLeftEndOnRectangleIcon className="fill-red-600" width="32" height="32" />
                </div>
              ) : (
                <div className="cursor-pointer" onClick={() => navigate('/login')}>
                  <ArrowRightEndOnRectangleIcon width="32" height="32" />
                </div>
              )}
            </Tooltip>
          )}
        </div>
      </footer>
    </>
  )
}

export default Footer
