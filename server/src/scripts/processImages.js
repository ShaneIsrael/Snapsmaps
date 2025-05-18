import fs from 'node:fs'
import path from 'node:path'
import { Op } from 'sequelize'
import sharp from 'sharp'
import Models from '../database/models'
import logger from '../utils/logger'

const { Image } = Models

const directories = ['/content/images/post', '/content/images/collection']

const quality = 50
const resizeWidth = 400

async function processImages() {
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      logger.info(`Directory does not exist: ${dir}`)
      continue
    }

    const supportedExtensions = ['.webp', '.png', '.jpg', '.jpeg', '.tiff', '.avif', '.gif', '.svg']

    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const ext = path.extname(file).toLowerCase()
      const baseName = path.basename(file, ext)
      const compressedFileName = `${baseName}.lowq.webp`
      const compressedFilePath = path.join(dir, compressedFileName)

      if (!supportedExtensions.includes(ext)) {
        logger.warn(`Skipping unsupported file: ${file}`)
        continue
      }

      if (['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
        try {
          if (fs.existsSync(compressedFilePath) || file.includes('.lowq.')) {
            continue
          }

          const metadata = await sharp(filePath).metadata()
          const referencePath = path.join('/', path.basename(dir), file)
          const image = await Image.findOne({
            where: {
              reference: referencePath,
              [Op.or]: [{ width: null }, { height: null }, { width: 0 }, { height: 0 }],
            },
          })

          if (image) {
            image.width = metadata.width
            image.height = metadata.height
            await image.save()
            logger.info(`Updated image metadata for: ${file}`)
          }

          // Verify the file is an actual image
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
