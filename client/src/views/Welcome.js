import React, { useCallback, useEffect, useState } from 'react'

import TestService from '../services/TestService'
import Post from '../components/Post/Post'
import Appbar from '../components/Layout/Appbar'
import { Image, Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import Footer from '../components/Layout/Footer'
import { useAuthed } from '../hooks/useAuthed'
import { FeedService } from '../services'
import { animate } from 'framer-motion'

const SCROLL_DELTA = 15

const Welcome = ({ mode }) => {
  const { user, isAuthenticated } = useAuthed()
  const [posts, setPosts] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalImage, setModalImage] = useState()
  const [lastScrollY, setLastScrollY] = useState(window.scrollY)
  const [showNav, setShowNav] = useState(true)

  async function fetch() {
    try {
      const feed = (await FeedService.getPublicFeed()).data
      setPosts(feed)
    } catch (err) {
      console.error(err)
    }
  }

  React.useEffect(() => {
    fetch()
  }, [])

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
      <div className="min-h-screen h-full flex justify-center flex-grow  pb-[44px] pt-4">
        <div className="flex flex-col scroll-smooth sm:max-w-[400px] w-full items-center gap-2">
          {posts?.map((post) => (
            <Post
              key={`post-${post.id}`}
              isSelf={user?.mention === post.user.mention}
              post={post}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>
      </div>
      <Footer refreshFeed={fetch} noProfile={!isAuthenticated} />
    </>
  )
}

Welcome.propTypes = {}

export default Welcome
