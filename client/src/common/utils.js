import FileSaver from 'file-saver'
import Cookies from 'js-cookie'
import _ from 'lodash'

export const getUrl = () => {
  if (window.location.hostname.indexOf('localhost') >= 0) return `${window.location.protocol}//localhost:3001`
  if (window.location.hostname.indexOf('snapsmaps') >= 0)
    return `${window.location.protocol}//${window.location.hostname}`

  return `${window.location.protocol}//${window.location.hostname}:${3001}`
}

export const getAssetUrl = () => {
  if (window.location.hostname.indexOf('snapsmaps') === -1) return getUrl()

  return 'https://cdn.snapsmaps.com'
}

export const getSessionUser = () => {
  const cookie = Cookies.get('user')
  if (!cookie) return null
  return JSON.parse(cookie)
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

const getCroppedImg = async (
  imageSrc,
  pixelCrop = { x: 0, y: 0 },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation)

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  ctx.drawImage(image, 0, 0)

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height)

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0)

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve({ file, url: URL.createObjectURL(file) })
    }, 'image/jpeg')
  })
}

export const downloadFile = async (reference) => {
  const image = await fetch(getAssetUrl() + reference)
  const imageBlob = await image.blob()
  const imageURL = URL.createObjectURL(imageBlob)

  const link = document.createElement('a')
  link.href = imageURL
  link.download = reference.substring(reference.lastIndexOf('/') + 1)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const canBrowserShareData = (data) => {
  if (!navigator.share || !navigator.canShare) {
    return false
  }
  return navigator.canShare(data)
}

export default getCroppedImg
