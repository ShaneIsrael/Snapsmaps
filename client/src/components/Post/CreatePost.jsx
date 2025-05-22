import { EyeIcon, EyeSlashIcon, NoSymbolIcon } from '@heroicons/react/24/solid'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalContent,
  Progress,
  Switch,
  Tab,
  Tabs,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@heroui/react'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { toast } from 'sonner'
import CloseIcon from '../../assets/icons/CloseIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import Nsfw2 from '../../assets/icons/Nsfw2'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import SendIcon from '../../assets/icons/SendIcon'
import Sfw from '../../assets/icons/Sfw'
import { PostService } from '../../services'
import SnapMap from '../Map/SnapMap'

function CreatePost({ imageData, onOpen, onSubmitted, onCancel }) {
  const abortControllerRef = useRef(new AbortController())
  const newPostModal = useDisclosure()
  const [selectedTab, setSelectedTab] = useState('photo')
  const [description, setDescription] = useState('')
  const [publicPost, setPublicPost] = useState(true)
  const [nsfw, setNsfw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)

  // abort the post upload if unmounted
  useEffect(() => {
    const controller = abortControllerRef.current
    return () => controller.abort()
  }, [])

  function reset() {
    setDescription('')
    setSelectedTab('photo')
    setSubmitting(false)
    setNsfw(false)
    setPublicPost(true)
    setLocationEnabled(true)
    setUploadProgress(0)
  }

  useEffect(() => {
    reset()

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
          locationEnabled ? imageData.gps : { longitude: null, latitude: null },
          imageData.file,
          locationEnabled,
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
      className='dark m-0 transform-gpu rounded-none p-0'
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
                onValueChange={(value) => setDescription(value.slice(0, import.meta.env.VITE_MAX_POST_TITLE_LENGTH))}
                maxRows={2}
                className="w-full"
                classNames={{
                  input: 'text-md',
                }}
                isDisabled={submitting}
              />
              <div className='mt-1 flex w-full'>
                <div className='mr-2 flex w-full flex-row-reverse items-center'>
                  <div className=' font-bold text-sm '>{publicPost ? 'PUBLIC' : 'PRIVATE'}</div>
                </div>
                <div className='flex items-center gap-0'>
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
                  <div className='mr-2 h-[31px] w-[3px] rounded-2xl bg-neutral-700' />

                  <Tooltip content={!locationEnabled ? 'location disabled' : 'location enabled'} color="primary">
                    <div>
                      <Switch
                        color={locationEnabled ? 'primary' : 'default'}
                        isSelected={locationEnabled}
                        onValueChange={setLocationEnabled}
                        size="lg"
                        startContent={<MapPinIcon />}
                        endContent={<NoSymbolIcon />}
                      />
                    </div>
                  </Tooltip>
                  <div className='mr-2 h-[31px] w-[3px] rounded-2xl bg-neutral-700' />
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
                <div className='flex w-full items-center'>
                  <div className='font-bold text-sm '>{nsfw ? 'NSFW' : 'SFW'}</div>
                </div>
              </div>
            </CardHeader>
            <CardBody className='relative h-full w-full px-0 py-0'>
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
                    </div>
                  }
                >
                  <div className='h-[400px] overflow-y-scroll'>
                    <img
                      alt="preview upload"
                      src={`data:image/png;base64,${imageData?.base64}`}
                      className={clsx('w-full object-cover', { 'blur-md': nsfw })}
                    />
                  </div>
                </Tab>
                {locationEnabled && (
                  <Tab
                    key="map"
                    title={
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== 'map' })} />
                      </div>
                    }
                    className="h-full"
                  >
                    <div className='h-[400px]'>
                      <SnapMap
                        markers={[{ lat: imageData?.gps.latitude, lng: imageData?.gps.longitude }]}
                        maxZoom={17} minZoom={3} defaultZoom={16}
                      />
                    </div>
                  </Tab>
                )}
              </Tabs>
            </CardBody>
            <CardFooter className='flex flex-col gap-2 px-4 pt-2 pb-5'>
              {submitting && (
                <div className='relative w-full justify-center align-middle'>
                  <p className='absolute bottom-0 z-10 w-full text-center font-extrabold text-sm tracking-widest'>
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
              <div className='flex w-full flex-row items-center justify-center gap-4 align-middle'>
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
