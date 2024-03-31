import {
  Button,
  Card,
  Image,
  Avatar,
  Divider,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  Input,
  Textarea,
} from '@nextui-org/react'
import React from 'react'
import Appbar from '../components/Layout/Appbar'
import Post from '../components/Post/Post'
import TestService from '../services/TestService'
import { useParams } from 'react-router-dom'
import { getSessionUser, getUrl } from '../common/utils'
import { CameraAltIcon } from '../assets/icons/CameraAltIcon'
import { ProfileService } from '../services'
import ImageCropProvider from '../providers/ImageCropProvider'
import ImageCrop from '../components/Cropper/ImageCrop'
/**
 * Show Avatar / name / mention / brif bio
 * Show post history
 * Show stats on number of posts, followers, and following
 * Option to switch to settings view
 * Allow editing of details / upload profile photo
 *
 */

function Profile({ isSelf }) {
  const postModal = useDisclosure()
  const imageModal = useDisclosure()

  const [isFollowed, setIsFollowed] = React.useState(false)
  const [post, setPost] = React.useState()
  const [modalImage, setModalImage] = React.useState()
  const [editMode, setEditMode] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const { mention } = useParams()

  const [profileDetails, setProfileDetails] = React.useState({
    displayName: '',
    email: '',
    mention: '',
    bio: '',
    image: '',
  })

  const [updatedProfileDetails, setUpdatedProfileDetails] = React.useState({
    displayName: '',
    email: '',
    mention: '',
    bio: '',
    image: '',
  })

  const handleOpenModal = () => {
    postModal.onOpen()
  }
  const handleOpenImageModal = (image) => {
    setModalImage(image)
    imageModal.onOpen()
  }

  async function fetch() {
    try {
      let profile
      if (!mention) {
        profile = getSessionUser()
      } else {
        // lookup profile
      }

      setProfileDetails(profile)
      setUpdatedProfileDetails(profile)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setSaving(true)
      const updatedProfile = (await ProfileService.update(updatedProfileDetails)).data
      fetch()
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
    setEditMode(false)
  }

  React.useEffect(() => {
    fetch()
  }, [mention])

  console.log(profileDetails)

  return (
    <>
      <Modal
        className="rounded-none transform-gpu w-fit h-fit "
        isOpen={imageModal.isOpen}
        onClose={imageModal.onClose}
        size="full"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="w-fit h-fit ">
          {(onClose) => (
            <>
              <Image className="rounded-none " onClick={imageModal.onClose} alt="a post image" src={modalImage} />
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        className="dark transform-gpu w-fit h-fit"
        isOpen={postModal.isOpen}
        onClose={postModal.onClose}
        placement="center"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="">
          {(onClose) => (
            <Post
              post={post}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenImageModal}
              width="300px"
            />
          )}
        </ModalContent>
      </Modal>
      <Appbar noProfile backButton="/" pageName={profileDetails.mention} />
      <div className="mt-8 mx-6">
        <div className="flex gap-5 max-w-[500px] justify-start items-start">
          <div className="flex flex-col gap-4">
            {editMode ? (
              <ImageCropProvider>
                <ImageCrop
                  onDone={(image) => setUpdatedProfileDetails((prev) => ({ ...prev, image, includesImage: true }))}
                />
              </ImageCropProvider>
            ) : (
              <Avatar
                src={profileDetails.image ? `${getUrl()}/${profileDetails.image}` : ''}
                isBordered
                className="w-20 h-20 text-large"
                color="primary"
              />
            )}

            {!isSelf && (
              <Button
                className={isFollowed ? 'bg-transparent text-foreground border-default-200 w-[80px]' : 'w-[80px]'}
                color="primary"
                radius="sm"
                size="sm"
                variant={isFollowed ? 'bordered' : 'solid'}
                onPress={() => setIsFollowed(!isFollowed)}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
              </Button>
            )}
            {isSelf && (
              <Button
                className={isFollowed ? 'bg-transparent text-foreground border-default-200 w-[80px]' : 'w-[80px]'}
                color={editMode ? 'primary' : 'default'}
                radius="sm"
                size="sm"
                variant={editMode ? 'bordered' : 'solid'}
                onPress={editMode ? handleUpdateProfile : () => setEditMode(true)}
                disabled={saving}
              >
                {editMode ? (saving ? 'Saving...' : 'Save') : 'Edit'}
              </Button>
            )}
          </div>
          <div className="w-full flex flex-col gap-4 items-start justify-center">
            <div className="h-[125px] w-full">
              {!editMode ? (
                <>
                  <h4 className="text-2xl font-semibold leading-none text-default-600">{profileDetails.displayName}</h4>
                  <h5 className="text-md tracking-tight text-blue-400">@{profileDetails.mention}</h5>
                  <p className="text-small tracking-tight text-default-500 mt-2">{profileDetails.bio}</p>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <Input
                    type="text"
                    size="md"
                    variant="bordered"
                    placeholder="Name"
                    value={updatedProfileDetails.displayName}
                    onValueChange={(value) => setUpdatedProfileDetails((prev) => ({ ...prev, displayName: value }))}
                    className="w-full"
                  />
                  <Input
                    type="text"
                    size="sm"
                    variant="bordered"
                    placeholder="@mention"
                    value={updatedProfileDetails.mention}
                    onValueChange={(value) => setUpdatedProfileDetails((prev) => ({ ...prev, mention: value }))}
                    className="w-full"
                  />
                  <Textarea
                    variant="bordered"
                    placeholder="Bio"
                    value={updatedProfileDetails.bio}
                    onValueChange={(value) => setUpdatedProfileDetails((prev) => ({ ...prev, bio: value }))}
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
                  <h2 className="text-xl font-extrabold text-default-600">117</h2>
                  <span className="text-md font-semibold text-default-600">posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-extrabold text-default-600">117</h2>
                  <span className="text-md font-semibold text-default-600">followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-extrabold text-default-600">117</h2>
                  <span className="text-md font-semibold  text-default-600">following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider className="my-5" />
        <div className="grid grid-cols-[repeat(auto-fill,100px)] gap-1 justify-center">
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/a/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/b/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/c/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/d/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/e/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/f/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/g/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/h/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/i/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/j/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
          <Image
            onClick={() => handleOpenModal()}
            alt="a history image"
            src="https://picsum.photos/seed/k/200/300"
            className="w-[100px] h-[100px] rounded-md object-cover cursor-pointer"
          />
        </div>
      </div>
    </>
  )
}

export default Profile
