import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CollectionService } from '../services'
import PageLayout from '../components/Layout/PageLayout'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import { getAssetUrl } from '../common/utils'
import clsx from 'clsx'
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Tab,
  Tabs,
} from '@nextui-org/react'
import ConfirmationDialog from '../components/Dialog/ConfirmationDialog'
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { MapPinIcon } from '../assets/icons/MapPinIcon'
import { PhotoIcon } from '../assets/icons/PhotoIcon'
import SnapMap from '../components/Map/SnapMap'

function Collection({ isSelfProfile }) {
  const location = useLocation()
  const { mention, collectionId } = useParams()
  const [collection, setCollection] = useState()
  const [index, setIndex] = useState()
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const [removeItem, setRemoveItem] = useState()
  const [allRemovedItems, setAllRemovedItems] = useState([])

  const [selectedTab, setSelectedTab] = useState('gallery')
  const [tabContainerOffset, setTabContainerOffset] = useState(0)
  const tabContainerRef = React.useRef()

  const handleRemoveItem = async () => {
    try {
      await CollectionService.removeItem(removeItem)
      setAllRemovedItems((prev) => [...prev, removeItem])
    } catch (err) {
      console.error(err)
    }
    setRemoveItem(null)
  }

  async function fetch() {
    setLoading(true)
    try {
      const response = (await CollectionService.get(collectionId)).data
      setCollection(response)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(false)
    fetch()
  }, [mention, collectionId])

  useEffect(() => {
    if (tabContainerRef.current) {
      setTabContainerOffset(tabContainerRef.current?.offsetTop + 45)
    }
  }, [tabContainerRef.current])

  const viewableItems = collection?.collectionPostLinks
    .filter((cpl) => !allRemovedItems.includes(cpl.id))
    .sort((a, b) => a.post.id - b.post.id)

  const images = viewableItems?.map((item) => ({
    id: item.id,
    postId: item.post.id,
    src: getAssetUrl() + item.post.image.reference,
    title: item.post.title,
  }))

  const mapMarkers = viewableItems?.map((item, index) => ({
    lat: item.post.image.latitude,
    lng: item.post.image.longitude,
    onClick: () => {
      setIndex(index)
      setLightboxOpen(true)
    },
  }))

  return (
    <PageLayout noProfile fullwidth backButton={() => navigate(-1)} pageName={collection?.title}>
      {({ user, isAuthenticated }) => (
        <>
          <ConfirmationDialog
            open={!!removeItem}
            title="Are you sure?"
            body="This action is not reversible."
            actionText="Remove Collection Item"
            actionColor="danger"
            cancelColor="default"
            onAction={handleRemoveItem}
            onCancel={() => setRemoveItem(null)}
          />
          <div className="border-b border-solid border-white pt-[65px]" />
          <div className="flex flex-col items-center mt-2 overflow-hidden">
            <Tabs
              key="collection-tabs"
              size="lg"
              variant="underlined"
              aria-label="Collection tabs"
              onSelectionChange={setSelectedTab}
              className="block"
            >
              <Tab
                key="gallery"
                title={
                  <div className="flex items-center space-x-2">
                    <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== `gallery` })} />
                    <span>Gallery</span>
                  </div>
                }
              >
                <div
                  ref={tabContainerRef}
                  className="flex flex-col items-center gap-2 overflow-y-scroll py-2"
                  style={{
                    height: `calc(100vh - ${tabContainerOffset}px)`,
                  }}
                >
                  {images ? (
                    images.map((image, index) => (
                      <div
                        key={`collection-photo-${index}`}
                        className="relative w-[90%] min-w-[370px] max-w-[495px] h-fit rounded-xl border-solid border-neutral-300 border-large"
                      >
                        {isAuthenticated && isSelfProfile && (
                          <Dropdown className="dark absolute min-w-0 p-[1px] w-fit bg-black -left-32">
                            <DropdownTrigger>
                              <Button variant="light" size="sm" className="absolute top-0 right-0" isIconOnly>
                                <EllipsisVerticalIcon className="w-5 h-5" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="collection item actions">
                              <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                onClick={() => setRemoveItem(image.id)}
                                startContent={<XMarkIcon className="h-4 w-4" />}
                              >
                                Remove Item
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                        <div className="absolute w-full bottom-0 flex items-end text-md font-bold pl-1 pr-1 pb-1 pt-1 rounded-b-xl bg-black/45 leading-tight">
                          {image.title}
                        </div>
                        <img
                          src={image.src}
                          className="object-cover rounded-lg "
                          onClick={() => {
                            setIndex(index)
                            setLightboxOpen(true)
                          }}
                          loading="lazy"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-full flex p-4 justify-center items-center">
                      <Spinner size="lg" />
                    </div>
                  )}
                </div>
              </Tab>
              <Tab
                key="map"
                title={
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== `map` })} />
                    <span>Map</span>
                  </div>
                }
              >
                <div
                  ref={tabContainerRef}
                  className={`overflow-hidden w-screen`}
                  style={{
                    height: `calc(100vh - ${tabContainerOffset}px)`,
                  }}
                >
                  <SnapMap markers={mapMarkers} streetViewControl />
                </div>
              </Tab>
            </Tabs>
            <Lightbox
              plugins={[Zoom]}
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={index}
              slides={images}
            />
          </div>
        </>
      )}
    </PageLayout>
  )
}

export default Collection
