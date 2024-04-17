import React, { useCallback, useEffect, useRef, useState } from 'react'

import Post from '../components/Post/Post'
import Appbar from '../components/Layout/Appbar'
import { Image, Modal, ModalContent, Spinner, Tab, Tabs, useDisclosure } from '@nextui-org/react'
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

  const [selectedFeed, setSelectedFeed] = useState('world')
  const worldFeed = useFeed('world')
  const followingFeed = useFeed('following')

  const handleRefreshFeeds = async (newPost) => {
    await worldFeed.refresh()
    await followingFeed.refresh()
    if (newPost) {
      followingFeed.setPosts((prev) => [newPost].concat(prev))
      worldFeed.setPosts((prev) => [newPost].concat(prev))
    }
  }

  const handleOpenModal = (image) => {
    setModalImage(image)
    onOpen()
  }

  const handleScrolling = useCallback(
    (e) => {
      const window = e.currentTarget
      if (lastScrollY > window.scrollTop + SCROLL_DELTA) {
        setShowNav(true)
      } else if (lastScrollY < window.scrollTop - SCROLL_DELTA) {
        setShowNav(false)
      }
      setLastScrollY(window.scrollTop)

      // handle paging
      const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
      if (bottom) {
        selectedFeed === 'world' ? worldFeed.nextPage() : followingFeed.nextPage()
      }
    },
    [lastScrollY],
  )

  useEffect(() => {
    const scrollElement = document.getElementById('scroll-content')
    setLastScrollY(scrollElement.scrollTop)
    scrollElement.addEventListener('scroll', handleScrolling)

    return () => {
      scrollElement.removeEventListener('scroll', handleScrolling)
    }
  }, [handleScrolling])

  return (
    <div className="flex flex-col h-screen">
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

      <div id="scroll-content" className="flex flex-col flex-grow items-center w-full overflow-y-scroll pt-[64px]">
        <Tabs key="feed-tabs" size="lg" variant="underlined" aria-label="Feed tabs" onSelectionChange={setSelectedFeed}>
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
              <Feed posts={worldFeed.posts} loading={worldFeed.isRefreshing} onOpenPostImage={handleOpenModal} />
              {worldFeed.isPageLoading && <Spinner size="lg" />}
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
                <Feed
                  posts={followingFeed.posts}
                  loading={followingFeed.isRefreshing}
                  onOpenPostImage={handleOpenModal}
                />
                {followingFeed.isPageLoading && <Spinner size="lg" />}
              </FeedWrapper>
            </Tab>
          )}
        </Tabs>
      </div>
      <Footer refreshFeed={handleRefreshFeeds} noProfile={!isAuthenticated} />
    </div>
  )
}

Welcome.propTypes = {}

export default Welcome
