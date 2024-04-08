import React from 'react'

import TestService from '../services/TestService'
import Post from '../components/Post/Post'
import Appbar from '../components/Layout/Appbar'
import { Image, Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import Footer from '../components/Layout/Footer'
import { useAuthed } from '../hooks/useAuthed'
import { FeedService } from '../services'

const Welcome = ({ mode }) => {
  const { user, isAuthenticated } = useAuthed()

  const [posts, setPosts] = React.useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalImage, setModalImage] = React.useState()

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
      <Appbar noProfile={!isAuthenticated} />
      <div className="min-h-screen h-full flex justify-center flex-grow  pb-[73px]">
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
      <Footer refreshFeed={fetch} />
    </>
  )
}

Welcome.propTypes = {}

export default Welcome
