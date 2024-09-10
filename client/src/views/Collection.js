import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CollectionService, ProfileService } from '../services'
import PageLayout from '../components/Layout/PageLayout'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import { getAssetUrl } from '../common/utils'
import clsx from 'clsx'
import { Divider } from '@nextui-org/react'

function Collection() {
  const location = useLocation()
  const { mention, collectionId } = useParams()
  const [collection, setCollection] = useState()
  const [index, setIndex] = useState()
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

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

  const handleImageClick = (index, item) => {
    setIndex(index)
    setLightboxOpen(true)
  }

  const images = collection?.collectionPostLinks
    .map((cpl) => ({
      postId: cpl.post.id,
      src: getAssetUrl() + cpl.post.image.reference,
      title: cpl.post.title,
    }))
    .sort((a, b) => a.postId - b.postId)

  return (
    <PageLayout noProfile fullwidth backButton={() => navigate(-1)} showNav={false}>
      {({ user, isAuthenticated }) => (
        <>
          <div className="relative flex justify-center w-full h-36">
            <div className="w-full max-w-[1000px] ">
              <div className="absolute w-full max-w-[1000px] bottom-0 flex items-end text-4xl font-lobster pl-2 pb-2 pt-2 bg-black/50">
                {collection?.title}
              </div>
              <img
                src={getAssetUrl() + collection?.image.reference}
                className={clsx('object-cover w-full h-full')}
                loading="lazy"
              />
            </div>
          </div>
          <div className="border-b-medium border-white" />
          <div className="flex flex-col items-center gap-2 max-h-screen overflow-y-scroll py-2">
            {images &&
              images.map((image, index) => (
                <div
                  key={`collection-photo-${index}`}
                  className="relative w-[90%] min-w-[370px] max-w-[495px] h-fit rounded-xl border-solid border-neutral-300 border-large"
                >
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
