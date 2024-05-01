import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Image, Modal, ModalContent, Spinner, Tab, Tabs, useDisclosure } from '@nextui-org/react'
import { UserGroupIcon } from '@heroicons/react/24/solid'
import { GlobeAmericasIcon } from '@heroicons/react/24/solid'
import Feed from '../components/feed/Feed'
import FeedWrapper from '../components/feed/FeedWrapper'
import { useFeed } from '../hooks/useFeed'
import PageLayout from '../components/Layout/PageLayout'

const SCROLL_DELTA = 15

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalImage, setModalImage] = useState()
  const [lastScrollY, setLastScrollY] = useState(window.scrollY)
  const [showNav, setShowNav] = useState(true)

  const [selectedFeed, setSelectedFeed] = useState('world')
  const worldFeed = useFeed('world')
  const followingFeed = useFeed('following')

  const refreshFeed = async (newPost) => {
    if (newPost) {
      followingFeed.setPosts((prev) => [newPost].concat(prev))
      worldFeed.setPosts((prev) => [newPost].concat(prev))
    } else {
      await worldFeed.refresh()
      await followingFeed.refresh()
    }
  }

  const handleOpenModal = (image) => {
    setModalImage(image)
    onOpen()
  }

  const handleScrolling = useCallback(
    (e) => {
      const window = e.currentTarget
      if (lastScrollY > window.scrollTop + SCROLL_DELTA && !showNav) {
        setShowNav(true)
      } else if (lastScrollY < window.scrollTop - SCROLL_DELTA && showNav) {
        setShowNav(false)
      }
      setLastScrollY(window.scrollTop)

      // handle paging
      const bottom = Math.round(e.target.scrollHeight - e.target.scrollTop) === Math.round(e.target.clientHeight)
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

  const handleHomeClicked = () => {
    document.getElementById('scroll-content').scrollTo(0, 0)
    refreshFeed()
  }

  const handlePostCreated = (newPost) => {
    refreshFeed(newPost)
  }

  return (
    <PageLayout onHome={handleHomeClicked} onSubmit={handlePostCreated} showNav={showNav} fullwidth>
      {({ user, isAuthenticated }) => (
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

          <div
            id="scroll-content"
            className="flex flex-col h-full items-center w-full overflow-y-auto overflow-x-hidden pt-[64px]"
          >
            <Tabs
              key="feed-tabs"
              size="lg"
              variant="underlined"
              aria-label="Feed tabs"
              onSelectionChange={setSelectedFeed}
            >
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
                  <Feed
                    posts={worldFeed.posts}
                    loading={worldFeed.isRefreshing}
                    onOpenPostImage={handleOpenModal}
                    user={user}
                    isAuthenticated={isAuthenticated}
                  />
                  {worldFeed.isPageLoading && !worldFeed.noMoreResults && <Spinner size="lg" />}
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
                      user={user}
                      isAuthenticated={isAuthenticated}
                    />
                    {followingFeed.isPageLoading && !followingFeed.noMoreResults && <Spinner size="lg" />}
                  </FeedWrapper>
                </Tab>
              )}
            </Tabs>
          </div>
        </>
      )}
    </PageLayout>
  )
}

Dashboard.propTypes = {}

export default Dashboard
