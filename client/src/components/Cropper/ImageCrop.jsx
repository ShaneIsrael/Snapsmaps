import { useRef, useState } from 'react'
// import user1 from '../assets/user_1.png';
// import Modal from '../components/base/Modal';
import { readFile } from '../../common/utils'
import ImageCropModalContent from './ImageCropModalContent'
import { useImageCropContext } from '../../providers/ImageCropProvider'
import { Avatar, Button, Modal, ModalContent, useDisclosure } from "@heroui/react"
import { CameraAltIcon } from '../../assets/icons/CameraAltIcon'
import { CameraIcon, FolderIcon } from '@heroicons/react/24/solid'

const ImageCrop = ({ onDone }) => {
  const captureDeviceSelect = useDisclosure()
  const [openModal, setOpenModal] = useState(false)
  const [preview, setPreview] = useState()

  const { getProcessedImage, setImage, resetStates } = useImageCropContext()

  const fileInput = useRef(null)
  const cameraInput = useRef(null)

  const handleDone = async () => {
    const avatar = await getProcessedImage()
    const blob = window.URL.createObjectURL(avatar)
    setOpenModal(false)
    setPreview(blob)
    resetStates()
    onDone(avatar)
  }

  const handleFileChange = async ({ target: { files } }) => {
    const file = files && files[0]
    const imageDataUrl = await readFile(file)
    setImage(imageDataUrl)
    setOpenModal(true)
  }
  return (
    <>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        className="hidden"
        id="avatarInput"
        accept="image/*"
      />
      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInput}
        onChange={handleFileChange}
        className="hidden"
      />
      <Avatar
        src={preview}
        isBordered
        className="w-20 h-20 text-large cursor-pointer"
        fallback={<CameraAltIcon className="animate-pulse w-8 h-8 text-default-500" fill="currentColor" size={36} />}
        onClick={captureDeviceSelect.onOpen}
      />

      <Modal
        className="dark transform-gpu p-0 m-0 rounded-b-none"
        isOpen={captureDeviceSelect.isOpen}
        onClose={captureDeviceSelect.onClose}
        placement="bottom"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent className="flex flex-row justify-center items-center pt-8 pb-8 gap-4">
          <Button
            size="lg"
            color="success"
            variant="faded"
            className="border-green-400 bg-green-950 text-green-400 "
            aria-label="new post"
            onClick={() => {
              cameraInput.current.click()
              captureDeviceSelect.onClose()
            }}
          >
            <CameraIcon />
          </Button>
          <Button
            size="lg"
            color="default"
            variant="flat"
            className="text-neutral-400"
            aria-label="new post"
            onClick={() => {
              fileInput.current.click()
              captureDeviceSelect.onClose()
            }}
          >
            <FolderIcon />
          </Button>
        </ModalContent>
      </Modal>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} className="dark rounded-b-none">
        <ModalContent>
          <ImageCropModalContent handleDone={handleDone} handleClose={() => setOpenModal(false)} />
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageCrop
