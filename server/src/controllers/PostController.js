const path = require('path')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')

const Models = require('../database/models')
const { Post, User, PostComment, Image } = Models
const { uploadImage } = require('../services/UploadService')

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

controller.getById = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('id of post is required')

    const post = await Post.findOne({
      where: { id },
      order: [[PostComment, 'createdAt', 'asc']],
      include: [
        { model: User, attributes: ['displayName', 'mention'], include: [Image] },
        Image,
        {
          model: PostComment,
          include: [{ model: User, include: [Image] }],
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
  req.setTimeout(300 * 1000)
  try {
    const { image } = req.files
    const { title, latitude, longitude } = req.body

    if (!title) return res.status(400).send('A post requires a title.')
    if (!image || !latitude || !longitude || !/^image/.test(image.mimetype))
      return res.status(400).send('A post requires an image and a gps location.')

    const reference = `/post/${uuidv4().replace(/-/gi, '')}.webp`
    const fileContent = Buffer.from(image.data)
    if (!isProduction) {
      await sharp(fileContent)
        .webp({ quality: 70 })
        .withMetadata()
        .toFile(path.join(process.cwd(), '/images', reference))
    } else {
      const compressed = await sharp(fileContent).webp({ quality: 70 }).withMetadata().toBuffer()
      await uploadImage(compressed, reference, 'image/webp')
    }

    const imageRow = await Image.create(
      {
        userId: req.session.user.id,
        reference,
        latitude,
        longitude,
      },
      { transaction: t },
    )
    const postRow = await Post.create(
      {
        title,
        userId: req.session.user.id,
        imageId: imageRow.id,
      },
      { transaction: t },
    )

    await t.commit()

    const created = await Post.findOne({
      where: { id: postRow.id },
      order: [[PostComment, 'createdAt', 'asc']],
      include: [
        { model: User, attributes: ['displayName', 'mention'], include: [Image] },
        Image,
        {
          model: PostComment,
          include: [{ model: User, include: [Image] }],
        },
      ],
    })

    return res.status(201).send(created)
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

controller.deletePost = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('an id is required')

    const post = await Post.findOne({ where: { id }, attributes: ['id', 'userId'] })

    if (post.userId !== req.session.user.id) {
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
    PostLike.create({
      userId: 1,
      postId: 1,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = controller
