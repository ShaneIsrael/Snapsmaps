import { Button } from '@nextui-org/react'
import React, { useRef } from 'react'
import PlusIcon from '../../assets/icons/PlusIcon'
import exifr from 'exifr'
import { toast } from 'sonner'

function UploadImage({ onImageUploaded }) {
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
    let exif, gps
    try {
      exif = await exifr.parse(file)
      gps = await exifr.gps(file)
    } catch (err) {
      return toast.error('Unknown or invalid image.')
    }
    if (!gps?.latitude || !gps?.longitude) {
      return toast.error(
        'No location data detected in the image. Check your camera settings and verify that location data is enabled.',
        { duration: 7500 },
      )
    }
    return onImageUploaded({
      buffer: file,
      base64: base64file,
      gps,
    })
  }
  return (
    <>
      <Button
        isIconOnly
        size="md"
        color="default"
        variant="ghost"
        className="border-medium border-neutral-200 "
        aria-label="new post"
        onClick={() => fileInput.current.click()}
      >
        <PlusIcon />
      </Button>
      <input id="image-input" type="file" accept="*" ref={fileInput} onChange={handleFileChange} className="hidden" />
    </>
  )
}

export default UploadImage
