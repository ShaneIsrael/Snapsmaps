import fs from 'node:fs'
import validator from 'email-validator'

export default {
  isValidEmail: (email) => validator.validate(email),
  capitalizeFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  convertDMSToDD: (degrees, minutes, seconds, direction) => {
    let dd = degrees + minutes / 60 + seconds / (60 * 60)
    if (direction === 'S' || direction === 'W') {
      dd = dd * -1
    }
    return dd
  },
  readHTMLFile: (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        callback(err)
      } else {
        callback(null, html)
      }
    })
  },
  createThumbnails: async () => {
    // const images = await Image.findAll()
    // for (const image of images) {
    //   logger.info(`creating thumbnail for ${image.reference}`)
    //   const thumbReference = `/thumb/120x120/${image.reference.split('/')[2]}`
    //   const input = (await axios({ url: 'https://cdn.snapsmaps.com' + image.reference, responseType: 'arraybuffer' }))
    //     .data
    //   const thumbnail = await sharp(input)
    //     .resize({
    //       fit: sharp.fit.cover,
    //       width: 120,
    //       height: 120,
    //     })
    //     .webp({ quality: 70 })
    //     .rotate()
    //     .withMetadata()
    //     .toBuffer()
    //   await uploadImage(thumbnail, thumbReference, 'image/webp')
    // }
    // logger.info('-- DONE CREATING THUMBNAILS --')
  },
}
