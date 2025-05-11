const path = require('path')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')

const { Op } = require('sequelize')
const Models = require('../database/models')
const { Post, User, PostComment, Image, PostLike, Follow, sequelize } = Models
const { uploadImage } = require('../services/UploadService')
const { createPostNotifications } = require('../services/NotificationService')
const { isFollowingUser } = require('../services/FollowService')
const { UserState } = require('../constants/UserState')
const { maxPostTitleLength } = require('../config').app
const { contentRoot } = require('../config')

const controller = {}

controller.getById = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('id of post is required')

    const include = [
      { model: User, attributes: ['displayName', 'mention', 'id'], include: [Image] },
      Image,
      {
        model: PostComment,
        include: [{ model: User, include: [Image] }],
      },
    ]
    if (req.session.user) {
      include.push({ model: PostLike, where: { userId: req.session?.user?.id }, required: false })
    }

    const post = await Post.findOne({
      where: { id },
      order: [[PostComment, 'createdAt', 'asc']],
      include,
    })
    const isFollowing = await isFollowingUser(req.session.user, post.user.id)

    if (!post.public && post.user.id !== req.session.user?.id && !isFollowing) {
      return res
        .status(401)
        .send('You are trying to view a private post. You must be a follower of the user to view their private posts.')
    }
    if (post.user.state === UserState.Banned) {
      return res.status(401).send('You cannot view the posts of a banned user.')
    }

    res.status(200).send(post)
  } catch (err) {
    next(err)
  }
}

controller.create = async (req, res, next) => {
  const t = await Models.sequelize.transaction()
  req.setTimeout(300 * 1000)
  let createdPost
  try {
    const { image } = req.files
    const { title, nsfw, latitude, longitude, public, locationEnabled } = req.body

    if (typeof title !== 'string') return res.status(400).send('title must be a string.')

    if (!image || !/^image/.test(image.mimetype)) return res.status(400).send('A post requires an image.')

    if (locationEnabled === 'true' && (!latitude || !longitude))
      return res.status(400).send('Location data is required for a location enabled post.')

    const uuid = uuidv4().replace(/-/gi, '')
    const reference = `/post/${uuid}.webp`
    const thumbReference = `/thumb/120x120/${uuid}.webp`
    const fileContent = Buffer.from(image.data)

    await sharp(fileContent)
      .webp({ quality: 100 })
      .rotate()
      .withMetadata()
      .toFile(path.join(contentRoot, '/images', reference))
    await sharp(fileContent)
      .resize({
        fit: sharp.fit.cover,
        width: 120,
        height: 120,
      })
      .webp({ quality: 100 })
      .rotate()
      .withMetadata()
      .toFile(path.join(contentRoot, '/images', thumbReference))

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
        title: title.slice(0, maxPostTitleLength),
        public,
        nsfw,
        userId: req.session.user.id,
        imageId: imageRow.id,
      },
      { transaction: t },
    )

    await t.commit()

    createdPost = await Post.findOne({
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

    res.status(201).send(createdPost)
  } catch (err) {
    await t.rollback()
    return next(err)
  }

  /**
   * async create notifications for followers
   */
  createPostNotifications(req.session.user.id, createdPost.id)
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

controller.getPostLikes = async (req, res, next) => {
  try {
    const { lastDate, id, pageSize } = req.query

    if (!id) return res.status(400).send('an id is required')

    const likes = await PostLike.findAll({
      where: {
        postId: id,
        createdAt: {
          [Op.lt]: lastDate || sequelize.fn('NOW'),
        },
      },
      order: [['createdAt', 'desc']],
      include: [{ model: User, include: [Image] }],
      limit: pageSize,
    })
    res.status(200).send(likes)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
