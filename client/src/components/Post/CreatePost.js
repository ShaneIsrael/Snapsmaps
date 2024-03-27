import {
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
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import GoogleMapReact from 'google-map-react'
import { GoogleMapDarkMode } from '../../common/themes'
import clsx from 'clsx'

function CreatePost({ imageData, onCancel }) {
  const newPostModal = useDisclosure()
  const [selectedTab, setSelectedTab] = useState('photo')
  const [description, setDescription] = useState('')

  const renderMarkers = (map, maps) => {
    new maps.Marker({
      position: { lat: imageData.gps.latitude, lng: imageData.gps.longitude },
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

  useEffect(() => {
    if (imageData) {
      newPostModal.onOpen()
    } else {
      newPostModal.onClose()
    }
  }, [imageData])

  const handleCancel = () => {
    onCancel()
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
            <CardHeader className="flex flex-col items-start gap-2">
              <h2 className="font-bold text-2xl">New post</h2>
              <Textarea
                variant="bordered"
                placeholder="Write something interesting..."
                value={description}
                onValueChange={setDescription}
                rows={3}
                maxRows={3}
                className="w-full"
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
                  <Image
                    width="100%"
                    src={`data:image/png;base64,${imageData?.base64}`}
                    className="object-cover rounded-none"
                    alt="preview image upload"
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
                  <div className="h-full">
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: 'AIzaSyA_PPhb-5jcZsLPcTdjoBBvF8CzvIbg4RE' }}
                      defaultCenter={{ lat: imageData?.gps.latitude, lng: imageData?.gps.longitude }}
                      defaultZoom={14}
                      yesIWantToUseGoogleMapApiInternals
                      onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
                      options={getMapOptions}
                    />
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
            <CardFooter className="p-6">
              <div className="w-full flex flex-row align-middle items-center justify-center gap-2">
                <Button color="danger" variant="flat" fullWidth onClick={handleCancel}>
                  Cancel
                </Button>
                <Button color="primary" fullWidth>
                  Submit
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
