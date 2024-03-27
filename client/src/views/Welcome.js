import React from 'react'

import TestService from '../services/TestService'
import Post from '../components/Post/Post'
import Appbar from '../components/Layout/Appbar'
import { Image, Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import Footer from '../components/Layout/Footer'

const Welcome = ({ mode }) => {
  const [post, setPost] = React.useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalImage, setModalImage] = React.useState()

  React.useEffect(() => {
    async function fetch() {
      try {
        const res = await TestService.test()
        setPost({
          ...res.data,
          body: 'This cat sleeps super weird. Why is she sleeping half on the pillow and half off?',
          id: 1,
        })
      } catch (err) {
        console.error(err)
      }
    }
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
      <Appbar />
      <div className="h-full flex justify-center pt-8 pb-8">
        <div className="flex flex-col items-center gap-4">
          {post && (
            <Post post={post} user={{ name: 'Shane Israel', mention: '@disshaneyo' }} onOpenModal={handleOpenModal} />
          )}
          {post && (
            <Post
              post={{ ...post, id: 2, image: 'https://i.imgur.com/uWFF1XM.jpg', body: 'Yes this is a cat.' }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
          {post && (
            <Post
              post={{ ...post, id: 3, image: 'https://i.imgur.com/XeddZEE.jpeg', body: 'A 16:9 image' }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
          {post && (
            <Post
              post={{ ...post, id: 4 }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
          {post && (
            <Post
              post={{ ...post, id: 5, image: 'https://i.imgur.com/uWFF1XM.jpg', body: 'Yes this is a cat.' }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
          {post && (
            <Post
              post={{ ...post, id: 6, image: 'https://i.imgur.com/XeddZEE.jpeg', body: 'A 16:9 image' }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
          {post && (
            <Post
              post={{ ...post, id: 7 }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
          {post && (
            <Post
              post={{ ...post, id: 9, image: 'https://i.imgur.com/uWFF1XM.jpg', body: 'Yes this is a cat.' }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
          {post && (
            <Post
              post={{ ...post, id: 10, image: 'https://i.imgur.com/XeddZEE.jpeg', body: 'A 16:9 image' }}
              user={{ name: 'Shane Israel', mention: '@disshaneyo' }}
              onOpenModal={handleOpenModal}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

Welcome.propTypes = {}

export default Welcome
