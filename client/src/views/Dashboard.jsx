import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal, ModalContent, Spinner, Tab, Tabs, useDisclosure } from "@heroui/react"
import { UserGroupIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { GlobeAmericasIcon } from '@heroicons/react/24/solid'
import Feed from '../components/Feed/Feed'
import FeedWrapper from '../components/Feed/FeedWrapper'
import { useFeed } from '../hooks/useFeed'
import PageLayout from '../components/Layout/PageLayout'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const SCROLL_DELTA = 15

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const feedRef = useRef()
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

      const bottom = Math.round(e.target.scrollHeight - e.target.scrollTop) <= Math.round(e.target.clientHeight + 50)
      if (bottom && !worldFeed.isPageLoading && !followingFeed.isPageLoading) {
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
          <Modal isOpen={isOpen} onClose={onClose} size="full" placement="center" backdrop="blur" hideCloseButton>
            <ModalContent className="bg-opacity-0">
              {(onClose) => (
                <>
                  <div className="relevant absolute top-2 right-2 z-10">
                    <Button size="md" variant="flat" isIconOnly onClick={onClose}>
                      <XMarkIcon className="text-neutral-50/90 h-7 w-7" />
                    </Button>
                  </div>
                  <TransformWrapper defaultScale={1}>
                    <TransformComponent>
                      <div className="w-screen h-screen flex justify-center">
                        <img className="object-contain" src={modalImage} alt="a post image" />
                      </div>
                    </TransformComponent>
                  </TransformWrapper>
                </>
              )}
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
                <FeedWrapper ref={feedRef}>
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
