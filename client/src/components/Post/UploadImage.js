import { Button } from '@nextui-org/react'
import React, { useRef } from 'react'
import exifr from 'exifr'
import { toast } from 'sonner'
import CameraIcon from '../../assets/icons/CameraIcon'
import FolderIcon from '../../assets/icons/FolderIcon'

function UploadImage({ onImageUploaded, mode }) {
  const fileInput = useRef(null)

  const handleFileChange = async (e) => {
    if (!e.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return toast.warning('Selection must be an image.')
    }
    const fileBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      reader.onerror = (err) => {
        reject(err)
      }
      reader.readAsArrayBuffer(e.target.files[0])
    })

    const file = new Uint8Array(fileBuffer)
    const base64file = btoa(new Uint8Array(file).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    let gps
    try {
      gps = await exifr.gps(file)
    } catch (err) {}
    if (!gps?.latitude || !gps?.longitude) {
      if (!navigator.geolocation) {
        toast.warning('Geolocation is not supported by your browser.')
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position?.coords) {
            return onImageUploaded({
              file: e.target.files[0],
              buffer: file,
              base64: base64file,
              gps: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              gpsOriginExif: false,
            })
          }
          return toast.error('Unable to capture location data.', { duration: 7500 })
        },
        (error) => toast.error(error.message),
      )
    } else {
      return onImageUploaded({
        file: e.target.files[0],
        buffer: file,
        base64: base64file,
        gps,
        gpsOriginExif: true,
      })
    }
  }
  if (mode === 'camera') {
    return (
      <>
        <Button
          size="lg"
          color="success"
          variant="faded"
          className="border-green-400 bg-green-950 text-green-400 "
          aria-label="new post"
          onClick={() => fileInput.current.click()}
        >
          <CameraIcon />
        </Button>
        <input
          id="image-input"
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInput}
          onChange={handleFileChange}
          className="hidden"
        />
      </>
    )
  }
  return (
    <>
      <Button
        size="lg"
        color="default"
        variant="flat"
        className="text-neutral-400"
        aria-label="new post"
        onClick={() => fileInput.current.click()}
      >
        <FolderIcon />
      </Button>
      <input
        id="image-input"
        type="file"
        accept={!!window.chrome ? 'image/*' : '*'}
        ref={fileInput}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  )
}

export default UploadImage
