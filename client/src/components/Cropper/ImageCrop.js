import { useRef, useState } from 'react'
// import user1 from '../assets/user_1.png';
// import Modal from '../components/base/Modal';
import { readFile } from '../../common/utils'
import ImageCropModalContent from './ImageCropModalContent'
import { useImageCropContext } from '../../providers/ImageCropProvider'
import { Avatar, Modal, ModalContent } from '@nextui-org/react'
import { CameraAltIcon } from '../../assets/icons/CameraAltIcon'

const ImageCrop = ({ onDone }) => {
  const [openModal, setOpenModal] = useState(false)
  const [preview, setPreview] = useState()

  const { getProcessedImage, setImage, resetStates } = useImageCropContext()

  const fileInput = useRef(null)

  const handleDone = async () => {
    const avatar = await getProcessedImage()
    const blob = window.URL.createObjectURL(avatar)
    setPreview(blob)
    resetStates()
    setOpenModal(false)
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
      <Avatar
        src={preview}
        isBordered
        className="w-20 h-20 text-large cursor-pointer"
        fallback={<CameraAltIcon className="animate-pulse w-8 h-8 text-default-500" fill="currentColor" size={36} />}
        onClick={() => fileInput.current.click()}
      />

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)} className="dark">
        <ModalContent>
          <ImageCropModalContent handleDone={handleDone} handleClose={() => setOpenModal(false)} />
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageCrop
