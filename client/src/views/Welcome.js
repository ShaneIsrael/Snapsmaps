import React, { useCallback, useEffect, useState } from 'react'

import Post from '../components/Post/Post'
import Appbar from '../components/Layout/Appbar'
import { Image, Modal, ModalContent, Tab, Tabs, useDisclosure } from '@nextui-org/react'
import Footer from '../components/Layout/Footer'
import { useAuthed } from '../hooks/useAuthed'
import { FeedService } from '../services'
import { UserGroupIcon } from '@heroicons/react/24/solid'
import { GlobeAmericasIcon } from '@heroicons/react/24/solid'
import Feed from '../components/feed/Feed'
import FeedWrapper from '../components/feed/FeedWrapper'
import { useFeed } from '../hooks/useFeed'

const SCROLL_DELTA = 15

const Welcome = ({ mode }) => {
  const { isAuthenticated } = useAuthed()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalImage, setModalImage] = useState()
  const [lastScrollY, setLastScrollY] = useState(window.scrollY)
  const [showNav, setShowNav] = useState(true)

  const [loadingWorld, postsWorld, refreshWorld] = useFeed('world')
  const [loadingFollowing, postsFollowing, refreshFollowing] = useFeed('following')

  const handleRefreshFeeds = () => {
    refreshWorld()
    refreshFollowing()
  }

  const handleOpenModal = (image) => {
    setModalImage(image)
    onOpen()
  }

  const handleScrolling = useCallback(
    (e) => {
      const window = e.currentTarget
      if (lastScrollY > window.scrollY + SCROLL_DELTA) {
        setShowNav(true)
      } else if (lastScrollY < window.scrollY - SCROLL_DELTA) {
        setShowNav(false)
      }
      setLastScrollY(window.scrollY)
    },
    [lastScrollY],
  )

  useEffect(() => {
    setLastScrollY(window.scrollY)
    window.addEventListener('scroll', handleScrolling)

    return () => {
      window.removeEventListener('scroll', handleScrolling)
    }
  }, [handleScrolling])

  return (
    <>
      <Modal
        className="rounded-none h-fit w-fit "
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="h-fit w-fit">
          {(onClose) => <Image className="rounded-none" onClick={onClose} alt="a post image" src={modalImage} />}
        </ModalContent>
      </Modal>
      <Appbar
        noProfile={!isAuthenticated}
        styles={{
          animation: `${showNav ? 'navbarShow' : 'navbarHide'} 0.2s ease forwards`,
        }}
      />

      <div className="flex flex-col items-center w-full">
        <Tabs key="feed-tabs" size="lg" variant="underlined" aria-label="Feed tabs">
          <Tab
            key="world"
            title={
              <div className="flex items-center space-x-2">
                <GlobeAmericasIcon className="w-6 h-6" />
                <span>World</span>
              </div>
            }
          >
            <FeedWrapper>
              <Feed posts={postsWorld} loading={loadingWorld} onOpenPostImage={handleOpenModal} />
            </FeedWrapper>
          </Tab>
          {isAuthenticated && (
            <Tab
              key="following"
              title={
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-6 h-6" />
                  <span>Following</span>
                </div>
              }
            >
              <FeedWrapper>
                <Feed posts={postsFollowing} loading={loadingFollowing} onOpenPostImage={handleOpenModal} />
              </FeedWrapper>
            </Tab>
          )}
        </Tabs>
      </div>
      <Footer refreshFeed={handleRefreshFeeds} noProfile={!isAuthenticated} />
    </>
  )
}

Welcome.propTypes = {}

export default Welcome
