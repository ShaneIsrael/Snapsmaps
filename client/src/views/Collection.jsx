import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CollectionService } from '../services'
import PageLayout from '../components/Layout/PageLayout'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { getAssetUrl } from '../common/utils'
import clsx from 'clsx'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tab, Tabs } from "@heroui/react"
import ConfirmationDialog from '../components/Dialog/ConfirmationDialog'
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { MapPinIcon } from '../assets/icons/MapPinIcon'
import { PhotoIcon } from '../assets/icons/PhotoIcon'
import SnapMap from '../components/Map/SnapMap'
import { LazyLoadImage } from 'react-lazy-load-image-component'

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
    lowqSrc: getAssetUrl() + item.post.image.reference.split('.')[0] + '.lowq.webp',
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
          <div className="px-4 pt-[65px] bg-background w-full max-w-[1500px] mx-auto">
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
                    <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== `gallery` })} />
                    <span>Gallery</span>
                  </div>
                }
                className="py-0"
              >
                <div className="h-[calc(100vh-155px)] overflow-y-auto pt-2">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{ 480: 1, 750: 3, 900: 4 }}
                    gutterBreakpoints={{ 480: '12px', 750: '16px', 900: '24px' }}
                  >
                    <Masonry>
                      {mappedImages?.map((image, index) => (
                        <div className="relative group">
                          <div
                            key={`collection-photo-${index}`}
                            className="relative rounded-lg border-solid border-neutral-300 border-small cursor-pointer overflow-hidden"
                          >
                            {isAuthenticated && isSelfProfile && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Dropdown className="dark absolute min-w-0 p-[1px] w-fit bg-black -left-32 ">
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
                              </div>
                            )}

                            {image.title && (
                              <div
                                className={clsx(
                                  'absolute w-full bottom-0 flex items-end text-xs  pl-1 pr-1 pb-1 pt-1 rounded-b-xl bg-black/75 leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300',
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
                  </ResponsiveMasonry>
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
                className="py-0"
              >
                <div
                  ref={tabContainerRef}
                  style={{
                    height: `calc(100vh - ${tabContainerOffset}px)`,
                  }}
                  className="pt-2"
                >
                  <SnapMap markers={mapMarkers} streetViewControl />
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
