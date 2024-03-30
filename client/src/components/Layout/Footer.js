import React, { useEffect, useState } from 'react'
import UploadImage from '../Post/UploadImage'
import CreatePost from '../Post/CreatePost'
import { Button, Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import PlusIcon from '../../assets/icons/PlusIcon'

function Footer({ refreshFeed }) {
  const [uploadedImageData, setUploadedImageData] = useState()
  const captureDeviceSelect = useDisclosure()

  return (
    <>
      <Modal
        className="dark transform-gpu p-0 m-0 rounded-b-none"
        isOpen={captureDeviceSelect.isOpen}
        onClose={captureDeviceSelect.onClose}
        placement="bottom"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="flex flex-row justify-center items-center pt-8 pb-8 gap-4">
          <UploadImage onImageUploaded={setUploadedImageData} mode="camera" />
          <UploadImage onImageUploaded={setUploadedImageData} />
        </ModalContent>
      </Modal>

      <CreatePost
        imageData={uploadedImageData}
        onOpen={captureDeviceSelect.onClose}
        onCancel={() => setUploadedImageData(null)}
        onSubmitted={() => {
          setUploadedImageData(null)
          refreshFeed()
        }}
      />
      <footer
        onClick={(e) => e.stopPropagation()}
        className="sticky bottom-0 pt-3 pb-3 flex z-40 mt-auto w-full h-auto items-center justify-center  inset-x-0 border-t border-divider backdrop-blur-lg backdrop-saturate-150 bg-background/70"
      >
        <Button
          isIconOnly
          size="md"
          color="default"
          variant="ghost"
          className="border-medium border-neutral-200 "
          aria-label="new post"
          onClick={(e) => {
            e.stopPropagation()
            captureDeviceSelect.onOpen()
          }}
        >
          <PlusIcon />
        </Button>
      </footer>
    </>
  )
}

export default Footer
