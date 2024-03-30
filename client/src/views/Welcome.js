import React from 'react'

import TestService from '../services/TestService'
import Post from '../components/Post/Post'
import Appbar from '../components/Layout/Appbar'
import { Image, Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import Footer from '../components/Layout/Footer'
import { useAuthed } from '../hooks/useAuthed'
import { FeedService } from '../services'

const Welcome = ({ mode }) => {
  const { loading, isAuthenticated } = useAuthed()

  const [posts, setPosts] = React.useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalImage, setModalImage] = React.useState()

  async function fetch() {
    try {
      const feed = (await FeedService.getPublicFeed()).data
      setPosts(feed)
      console.log(feed)
      // const res = await TestService.test()
      // setPost({
      //   ...res.data,
      //   body: 'This cat sleeps super weird. Why is she sleeping half on the pillow and half off?',
      //   id: 1,
      // })
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
        className="rounded-none transform-gpu w-fit h-fit"
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="w-fit h-fit">
          {(onClose) => (
            <>
              <Image className="rounded-none" onClick={onClose} alt="a post image" src={modalImage} />
            </>
          )}
        </ModalContent>
      </Modal>
      <Appbar noProfile={!isAuthenticated} />
      <div className="h-full flex justify-center flex-grow pt-8 pb-8">
        <div className="flex flex-col max-w-[375px] w-full p-2 items-center gap-4">
          {posts?.map((post) => (
            <Post key={`post-${post.id}`} post={post} onOpenModal={handleOpenModal} />
          ))}
        </div>
      </div>
      <Footer refreshFeed={fetch} />
    </>
  )
}

Welcome.propTypes = {}

export default Welcome
