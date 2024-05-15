import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
  Progress,
  Switch,
  Tooltip,
} from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import clsx from 'clsx'
import CloseIcon from '../../assets/icons/CloseIcon'
import SendIcon from '../../assets/icons/SendIcon'
import { PostService } from '../../services'
import { toast } from 'sonner'
import SnapMap from '../Map/SnapMap'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import Nsfw from '../../assets/icons/Nsfw'
import Sfw from '../../assets/icons/Sfw'
import Nsfw2 from '../../assets/icons/Nsfw2'

function CreatePost({ imageData, onOpen, onSubmitted, onCancel }) {
  const abortControllerRef = useRef(new AbortController())
  const newPostModal = useDisclosure()
  const [selectedTab, setSelectedTab] = useState('photo')
  const [description, setDescription] = useState('')
  const [publicPost, setPublicPost] = useState(true)
  const [nsfw, setNsfw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // abort the post upload if unmounted
  useEffect(() => {
    const controller = abortControllerRef.current
    return () => controller.abort()
  }, [])

  useEffect(() => {
    setDescription('')
    setSelectedTab('photo')
    setSubmitting(false)
    setNsfw(false)
    setPublicPost(true)
    setUploadProgress(0)

    if (imageData) {
      newPostModal.onOpen()
      onOpen()
    } else {
      newPostModal.onClose()
    }
  }, [imageData])

  const handleCancel = () => {
    if (submitting) {
      abortControllerRef.current.abort()
    }
    onCancel()
  }

  const submit = async () => {
    try {
      setSubmitting(true)
      const post = (
        await PostService.create(
          description,
          publicPost,
          nsfw,
          imageData.gps,
          imageData.file,
          (progress) => setUploadProgress(progress),
          abortControllerRef.current.signal,
        )
      ).data
      onSubmitted(post)
    } catch (err) {
      if (err.response?.status === 413) {
        return toast.error(err.response.data)
      }
      if (err.response?.data) {
        return toast.error(err.response.data)
      }
    }
    setSubmitting(false)
    setUploadProgress(0)
    newPostModal.onClose()
  }

  return (
    <Modal
      className="dark transform-gpu rounded-none m-0 p-0"
      isOpen={newPostModal.isOpen}
      onClose={newPostModal.onClose}
      placement="top"
      size={isMobile ? 'full' : 'lg'}
    >
      <ModalContent className="">
        {(onClose) => (
          <Card className="h-full w-full rounded-none bg-black">
            <CardHeader className="flex flex-col items-center gap-2 pt-1">
              <h2 className="font-bold text-2xl">New Post</h2>
              <Textarea
                variant="bordered"
                placeholder="Write something interesting..."
                value={description}
                onValueChange={(value) => setDescription(value.slice(0, process.env.REACT_APP_MAX_POST_TITLE_LENGTH))}
                maxRows={2}
                className="w-full"
                classNames={{
                  input: 'text-md',
                }}
                isDisabled={submitting}
              />
              <div className="flex w-full mt-1">
                <div className="flex flex-row-reverse mr-2 w-full items-center">
                  <div className=" text-sm font-bold ">{publicPost ? 'PUBLIC' : 'PRIVATE'}</div>
                </div>
                <div className="flex gap-0 items-center">
                  <Tooltip content={publicPost ? 'public post' : 'private post'} color="primary">
                    <div>
                      <Switch
                        color={publicPost ? 'primary' : 'default'}
                        isSelected={publicPost}
                        onValueChange={setPublicPost}
                        size="lg"
                        startContent={<EyeIcon />}
                        endContent={<EyeSlashIcon />}
                      />
                    </div>
                  </Tooltip>
                  <div className="h-[31px] w-[3px] bg-neutral-700 mr-2 rounded-2xl" />
                  <Tooltip content={!nsfw ? 'safe for work' : 'not safe for work'} color="danger">
                    <div>
                      <Switch
                        color={nsfw ? 'danger' : 'default'}
                        isSelected={nsfw}
                        onValueChange={setNsfw}
                        size="lg"
                        startContent={<Nsfw2 />}
                        endContent={<Sfw />}
                      />
                    </div>
                  </Tooltip>
                </div>
                <div className="flex items-center w-full">
                  <div className="text-sm font-bold ">{nsfw ? 'NSFW' : 'SFW'}</div>
                </div>
              </div>
            </CardHeader>
            <CardBody className="py-0 px-0 relative w-full h-full">
              <Tabs
                aria-label="post tabs"
                size="md"
                color="primary"
                radius="full"
                selectedKey={selectedTab}
                onSelectionChange={setSelectedTab}
                className="block"
                classNames={{
                  tabList: 'mb-2 mx-3 bg-slate-900',
                  panel: 'p-0',
                }}
              >
                <Tab
                  key="photo"
                  title={
                    <div className="flex items-center space-x-2">
                      <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== 'photo' })} />
                      <span></span>
                    </div>
                  }
                  className="overflow-y-auto"
                >
                  <img
                    alt="preview image upload"
                    src={`data:image/png;base64,${imageData?.base64}`}
                    className={clsx('object-cover w-full h-full', { 'blur-md': nsfw })}
                  />
                </Tab>
                <Tab
                  key="map"
                  title={
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== 'map' })} />
                      <span></span>
                    </div>
                  }
                  className="h-full"
                >
                  <div className="overflow-hidden h-full sm:h-[680px] ">
                    <SnapMap
                      markers={[{ lat: imageData?.gps.latitude, lng: imageData?.gps.longitude }]}
                      defaultZoom={16}
                    />
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter className="flex flex-col px-4 pt-2 pb-5 gap-2">
              {submitting && (
                <div className="relative align-middle justify-center w-full">
                  <p className="absolute bottom-0 text-center text-sm font-extrabold tracking-widest w-full z-10">
                    {uploadProgress}%...
                  </p>
                  <Progress
                    isStriped
                    size="lg"
                    aria-label="Uploading..."
                    color="primary"
                    value={uploadProgress}
                    className="max-w-md"
                  />
                </div>
              )}
              <div className="w-full flex flex-row align-middle items-center justify-center gap-4">
                <Button size="md" color="danger" variant="flat" fullWidth onClick={handleCancel}>
                  <CloseIcon />
                </Button>

                <Button size="md" color="primary" variant="solid" fullWidth onClick={submit} isDisabled={submitting}>
                  {submitting ? 'Posting...' : <SendIcon />}
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CreatePost
