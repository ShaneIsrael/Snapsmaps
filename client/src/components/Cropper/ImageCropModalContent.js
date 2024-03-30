import { Button, Divider } from '@nextui-org/react'
import { readFile } from '../../common/utils'
import { useImageCropContext } from '../../providers/ImageCropProvider'
import Cropper from './Cropper'
import { RotationSlider, ZoomSlider } from './Sliders'

const ImageCropModalContent = ({ handleDone, handleClose }) => {
  const { setImage } = useImageCropContext()

  const handleFileChange = async ({ target: { files } }) => {
    const file = files && files[0]
    const imageDataUrl = await readFile(file)
    setImage(imageDataUrl)
  }

  return (
    <div className="text-center relative">
      <h5 className="text-neutral-50 text-lg font-semibold my-2">Crop & Save</h5>
      <Divider />
      <div className="p-6 rounded-lg">
        <div className="flex justify-center">
          <div className="relative w-[233px] h-[233px] mb-4">
            <Cropper />
          </div>
        </div>
        <ZoomSlider className="mb-4" />
        <RotationSlider className="mb-4" />

        <div className="flex gap-2">
          <Button variant="bordered" className="w-full" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" variant="solid" className="w-full" onClick={handleDone}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModalContent
