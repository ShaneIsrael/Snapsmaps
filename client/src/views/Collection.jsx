import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import PageLayout from '../components/Layout/PageLayout'
import { CollectionService } from '../services'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tab, Tabs } from '@heroui/react'
import { Masonry } from '@mui/lab'
import clsx from 'clsx'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { MapPinIcon } from '../assets/icons/MapPinIcon'
import { PhotoIcon } from '../assets/icons/PhotoIcon'
import { getAssetUrl } from '../common/utils'
import ConfirmationDialog from '../components/Dialog/ConfirmationDialog'
import SnapMap from '../components/Map/SnapMap'

function Collection({ isSelfProfile }) {
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
  }, [collectionId])

  useEffect(() => {
    if (tabContainerRef.current) {
      setTabContainerOffset(tabContainerRef.current?.offsetTop + 45)
    }
  }, [tabContainerRef.current])

  const viewableItems = collection?.collectionPostLinks
    .filter((cpl) => !allRemovedItems.includes(cpl.id))
    .sort((a, b) => a.post.id - b.post.id)

  const mappedImages = viewableItems?.map((item) => ({
    id: item.id,
    postId: item.post.id,
    src: getAssetUrl() + item.post.image.reference,
    lowqSrc: `${getAssetUrl() + item.post.image.reference.split('.')[0]}.lowq.webp`,
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
          <Lightbox
            plugins={[Zoom]}
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={index}
            slides={mappedImages}
          />
          <div className="mx-auto w-full max-w-[1500px] bg-background px-4 pt-[65px]">
            <Tabs
              key="collection-tabs"
              size="md"
              variant="underlined"
              aria-label="Collection tabs"
              onSelectionChange={setSelectedTab}
              className="block"
            >
              <Tab
                key="gallery"
                title={
                  <div className="flex items-center space-x-2">
                    <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== 'gallery' })} />
                    <span>Gallery</span>
                  </div>
                }
                className="py-0"
              >
                <div className="h-[calc(100vh-155px)] overflow-y-auto pt-2">
                  <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={1} sx={{
                    '& > img': {
                      display: 'inline',
                    },
                  }}>
                    {mappedImages?.map((image, index) => (
                      <div key={image.src} className="group relative">
                        <div
                          key={`collection-photo-${image.src}`}
                          className="relative cursor-pointer overflow-hidden rounded-lg border-neutral-300 border-small border-solid"
                        >
                          {isAuthenticated && isSelfProfile && (
                            <div className="opacity-0 transition-opacity group-hover:opacity-100">
                              <Dropdown className="dark -left-32 absolute w-fit min-w-0 bg-black p-[1px] ">
                                <DropdownTrigger>
                                  <Button variant="light" size="sm" className="absolute top-0 right-0" isIconOnly>
                                    <EllipsisVerticalIcon className="h-5 w-5" />
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
                            </div>
                          )}

                          {image.title && (
                            <div
                              className={clsx(
                                'absolute bottom-0 z-10 flex w-full items-end rounded-b-xl bg-black/75 pt-1 pr-1 pb-1 pl-1 text-xs leading-tight opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                              )}
                            >
                              {image.title}
                            </div>
                          )}

                          <LazyLoadImage
                            placeholderSrc={image.lowqSrc}
                            effect="blur"
                            src={image.src}
                            onClick={() => {
                              setIndex(index)
                              setLightboxOpen(true)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </Masonry>
                </div>
              </Tab>
              <Tab
                key="map"
                title={
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== 'map' })} />
                    <span>Map</span>
                  </div>
                }
                className="py-0"
              >
                <div
                  ref={tabContainerRef}
                  style={
                    {
                      // height: `calc(100vh - ${tabContainerOffset}px) overflow-y-hidden`,
                    }
                  }
                  className="pt-2"
                >
                  <SnapMap markers={mapMarkers} streetViewControl mapClassName="h-[calc(100vh-160px)]" />
                </div>
              </Tab>
            </Tabs>
          </div>
        </>
      )}
    </PageLayout>
  )
}

export default Collection
