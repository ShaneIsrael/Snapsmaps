const path = require('path')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')

const Models = require('../database/models')
const { uploadImage } = require('../services/UploadService')

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

controller.getById = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('id of post is required')

    const post = await Models.post.findOne({
      where: { id },
      order: [[Models.postComment, 'createdAt', 'asc']],
      include: [
        { model: Models.user, attributes: ['displayName', 'mention'], include: [Models.image] },
        Models.image,
        {
          model: Models.postComment,
          include: [{ model: Models.user, include: [Models.image] }],
        },
      ],
    })

    res.status(200).send(post)
  } catch (err) {
    next(err)
  }
}

controller.create = async (req, res, next) => {
  const t = await Models.sequelize.transaction()

  try {
    const { image } = req.files
    const { title, latitude, longitude } = req.body

    if (!title) return res.status(400).send('A post requires a title.')
    if (!image || !latitude || !longitude || !/^image/.test(image.mimetype))
      return res.status(400).send('A post requires an image and a gps location.')

    const reference = `/post/${uuidv4().replace(/-/gi, '')}${image.name.substring(image.name.lastIndexOf('.'))}`
    const fileContent = Buffer.from(image.data)
    if (!isProduction) {
      await sharp(fileContent).jpeg({ quality: 60 }).toFile(path.join(process.cwd(), '/images', reference))
    } else {
      const compressed = await sharp(fileContent).jpeg({ quality: 60 }).toBuffer()
      await uploadImage(compressed, reference, image.mimetype)
    }

    const imageRow = await Models.image.create(
      {
        userId: req.user.id,
        reference,
        latitude,
        longitude,
      },
      { transaction: t },
    )
    const postRow = await Models.post.create(
      {
        title,
        userId: req.user.id,
        imageId: imageRow.id,
      },
      { transaction: t },
    )

    await t.commit()

    return res.sendStatus(200)
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

controller.deletePost = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('an id is required')

    const post = await Models.post.findOne({ where: { id }, attributes: ['id', 'userId'] })

    if (post.userId !== req.user.id) {
      return res.status(400).send('only the owner of a post can delete a post')
    }

    await post.destroy()

    return res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

controller.test = async (req, res, next) => {
  try {
    Models.postLike.create({
      userId: 1,
      postId: 1,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = controller
