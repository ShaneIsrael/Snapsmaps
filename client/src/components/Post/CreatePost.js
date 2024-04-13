import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Modal,
  ModalContent,
  Spinner,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
  Progress,
} from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import GoogleMapReact from 'google-map-react'
import { GoogleMapDarkMode } from '../../common/themes'
import clsx from 'clsx'
import CloseIcon from '../../assets/icons/CloseIcon'
import SendIcon from '../../assets/icons/SendIcon'
import { PostService } from '../../services'
import { toast } from 'sonner'
import SnapMap from '../Map/SnapMap'

function CreatePost({ imageData, onOpen, onSubmitted, onCancel }) {
  const abortControllerRef = useRef(new AbortController())
  const newPostModal = useDisclosure()
  const [selectedTab, setSelectedTab] = useState('photo')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const renderMarkers = (map, maps) => {
    new maps.Marker({
      position: { lat: imageData.gps.latitude, lng: imageData.gps.longitude },
      map,
    })
  }

  const getMapOptions = (maps) => {
    return {
      streetViewControl: false,
      scaleControl: false,
      fullscreenControl: false,
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
      minZoom: 16,
      maxZoom: 16,

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

  // abort the post upload if unmounted
  useEffect(() => {
    const controller = abortControllerRef.current
    return () => controller.abort()
  }, [])

  useEffect(() => {
    setDescription('')
    setSelectedTab('photo')
    setSubmitting(false)
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
      await PostService.create(
        description,
        imageData.gps,
        imageData.file,
        (progress) => setUploadProgress(progress),
        abortControllerRef.current.signal,
      )
      onSubmitted()
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
  }

  return (
    <Modal
      className="dark transform-gpu w-full h-full sm:max-h-[900px] rounded-none m-0 p-0"
      isOpen={newPostModal.isOpen}
      onClose={newPostModal.onClose}
      placement="top"
    >
      <ModalContent className="">
        {(onClose) => (
          <Card className="h-full w-full rounded-none">
            <CardHeader className="flex flex-col items-center gap-2">
              <h2 className="font-bold text-2xl">New Post</h2>
              <Textarea
                variant="bordered"
                placeholder="Write something interesting..."
                value={description}
                onValueChange={setDescription}
                maxRows={2}
                className="w-full"
                classNames={{
                  input: 'text-md',
                }}
                isDisabled={submitting}
              />
            </CardHeader>
            <CardBody className="px-3 py-0 ">
              <Tabs
                aria-label="post tabs"
                color="primary"
                radius="full"
                selectedKey={selectedTab}
                onSelectionChange={setSelectedTab}
                className="block"
                classNames={{
                  tabList: 'mb-2',
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
                  className="overflow-y-scroll"
                >
                  <div className="flex align-middle h-[385px] justify-center ">
                    <img
                      alt="preview image upload"
                      src={`data:image/png;base64,${imageData?.base64}`}
                      className="object-cover w-full h-full rounded-2xl"
                    />
                  </div>
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
                  <div className="overflow-hidden rounded-2xl h-[365px]">
                    <SnapMap
                      markers={[{ lat: imageData?.gps.latitude, lng: imageData?.gps.longitude }]}
                      defaultZoom={16}
                    />
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter className="flex flex-col px-3 pt-2 pb-6 gap-2">
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
                <Button color="danger" variant="flat" fullWidth onClick={handleCancel}>
                  <CloseIcon />
                </Button>
                <Button color="primary" variant="solid" fullWidth onClick={submit} isDisabled={submitting}>
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
