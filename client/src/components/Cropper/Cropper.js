import EasyCropper from 'react-easy-crop'
import { useImageCropContext } from '../../providers/ImageCropProvider'

const Cropper = () => {
  const { image, zoom, max_zoom, setZoom, rotation, setRotation, crop, setCrop, onCropComplete } = useImageCropContext()

  return (
    <EasyCropper
      maxZoom={max_zoom}
      image={image || undefined}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      cropShape="round"
      aspect={1}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
      setRotation={setRotation}
      showGrid={false}
      cropSize={{ width: 185, height: 185 }}
      style={{
        containerStyle: {
          height: 220,
          width: 220,
          top: 8,
          bottom: 8,
          left: 8,
          right: 8,
        },
      }}
    />
  )
}

export default Cropper
