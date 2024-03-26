const path = require('path')
const { convertDMSToDD } = require('../utils')
const ExifImage = require('exif').ExifImage

const controller = {}

controller.test = async (req, res, next) => {
  const imagePath = path.resolve('../server/images/test_image_1.jpg')

  try {
    const gpsData = await new Promise(
      (resolve, reject) =>
        new ExifImage({ image: imagePath }, (err, exifData) => {
          if (err) return reject(err)

          const latitude = exifData.gps.GPSLatitude
          const longitude = exifData.gps.GPSLongitude
          const latRef = exifData.gps.GPSLatitudeRef
          const lngRef = exifData.gps.GPSLongitudeRef

          resolve({
            lat: convertDMSToDD(latitude[0], latitude[1], latitude[2], latRef),
            lng: convertDMSToDD(longitude[0], longitude[1], longitude[2], lngRef),
          })
        }),
    )

    res.status(200).send({
      image: 'https://i.imgur.com/OS0EWYn.jpeg',
      gps: gpsData,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = controller
