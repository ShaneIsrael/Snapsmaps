const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const logger = require('../utils/logger')

const directories = ['/content/images/post', '/content/images/collection']

const quality = 50
const resizeWidth = 400

async function processImages() {
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      logger.info(`Directory does not exist: ${dir}`)
      continue
    }

    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const ext = path.extname(file).toLowerCase()
      const baseName = path.basename(file, ext)
      const compressedFileName = `${baseName}.lowq.webp`
      const compressedFilePath = path.join(dir, compressedFileName)

      if (compressedFileName === file || fs.existsSync(compressedFilePath)) {
        continue
      }

      if (['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
        try {
          // Verify the file is an actual image
          const metadata = await sharp(filePath).metadata()
          const shouldResize = metadata.width > resizeWidth

          logger.info(`Compressing: ${file} -> ${compressedFileName}`)
          const sharpInstance = sharp(filePath)

          if (shouldResize) {
            sharpInstance.resize({ width: resizeWidth })
          }

          await sharpInstance.webp({ quality }).toFile(compressedFilePath)
        } catch (err) {
          logger.error(`Skipping invalid image file: ${file} - ${err.message}`)
        }
      } else {
        logger.info(`Skipping non-image file: ${file}`)
      }
    }
  }
}

processImages().then(() => logger.info('Image processing complete.'))
