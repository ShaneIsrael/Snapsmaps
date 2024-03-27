import React, { useState } from 'react'
import UploadImage from '../Post/UploadImage'
import CreatePost from '../Post/CreatePost'

function Footer() {
  const [uploadedImageData, setUploadedImageData] = useState()
  return (
    <>
      <CreatePost imageData={uploadedImageData} onCancel={() => setUploadedImageData(null)} />
      <footer
        onClick={(e) => e.stopPropagation()}
        className="sticky bottom-0 p-2 flex z-40 w-full h-auto items-center justify-center  inset-x-0 border-t border-divider backdrop-blur-lg backdrop-saturate-150 bg-background/70"
      >
        <UploadImage onImageUploaded={setUploadedImageData} />
      </footer>
    </>
  )
}

export default Footer
