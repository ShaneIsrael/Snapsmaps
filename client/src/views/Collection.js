import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CollectionService, ProfileService } from '../services'
import PageLayout from '../components/Layout/PageLayout'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import { getAssetUrl } from '../common/utils'
import clsx from 'clsx'
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import ConfirmationDialog from '../components/Dialog/ConfirmationDialog'
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid'

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

  const images = collection?.collectionPostLinks
    .map((cpl) => ({
      id: cpl.id,
      postId: cpl.post.id,
      src: getAssetUrl() + cpl.post.image.reference,
      title: cpl.post.title,
    }))
    .filter((img) => !allRemovedItems.includes(img.id))
    .sort((a, b) => a.postId - b.postId)

  console.log(images)
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
          <div className="flex flex-col items-center gap-2 max-h-screen overflow-y-scroll py-2">
            {images &&
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
              ))}
          </div>

          <Lightbox
            plugins={[Zoom]}
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={index}
            slides={images}
          />
        </>
      )}
    </PageLayout>
  )
}

export default Collection
