const path = require('path')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')

const Models = require('../database/models')
const { Post, User, Collection, CollectionPostLink, Image, PostLike } = Models
const { uploadImage } = require('../services/UploadService')
const { isFollowingUser } = require('../services/FollowService')
const { UserState } = require('../constants/UserState')
const { maxCollectionTitleLength } = require('../config').app

const { contentRoot, isProduction } = require('../config')

const controller = {}

controller.getById = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('id of collection is required')

    const include = [
      { model: User, attributes: ['displayName', 'mention', 'id'], include: [Image] },
      Image,
      {
        model: CollectionPostLink,
        include: [{ model: Post, include: [Image] }],
      },
    ]

    const collection = await Collection.findOne({
      where: { id },
      order: [[CollectionPostLink, 'createdAt', 'asc']],
      include,
    })
    const isFollowing = await isFollowingUser(req.session.user, collection.user.id)

    if (!collection.public && collection.user.id !== req.session.user?.id && !isFollowing) {
      return res
        .status(401)
        .send(
          'You are trying to view a private collection. You must be a follower of the user to view their private collections.',
        )
    }
    if (collection.user.state === UserState.Banned) {
      return res.status(401).send('You cannot view the posts of a banned user.')
    }

    res.status(200).send(collection)
  } catch (err) {
    next(err)
  }
}

controller.create = async (req, res, next) => {
  const t = await Models.sequelize.transaction()
  req.setTimeout(300 * 1000)
  let createdCollection
  try {
    const { image } = req.files
    const { title, public } = req.body
    const items = Array.isArray(req.body['items[]']) ? req.body['items[]'] : [req.body['items[]']]

    if (typeof title !== 'string') return res.status(400).send('title must be a string.')
    if (items.length === 0) return res.status(400).send('a collection must include at least one item.')

    if (!image || !/^image/.test(image.mimetype)) return res.status(400).send('A collection requires an image')

    const uuid = uuidv4().replace(/-/gi, '')
    const reference = `/collection/${uuid}.webp`
    // const thumbReference = `/thumb/120x120/${uuid}.webp`
    const fileContent = Buffer.from(image.data)

    await sharp(fileContent)
      .webp({ quality: 100 })
      .rotate()
      .withMetadata()
      .toFile(path.join(contentRoot, '/images', reference))

    const imageRow = await Image.create(
      {
        userId: req.session.user.id,
        reference,
      },
      { transaction: t },
    )
    const collectionRow = await Collection.create(
      {
        title: title.slice(0, maxCollectionTitleLength),
        public,
        userId: req.session.user.id,
        imageId: imageRow.id,
      },
      { transaction: t },
    )

    const history = await Post.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', 'desc']],
      attributes: ['id'],
    })

    const historyIds = history.map((h) => h.id)
    const validItems = items.filter((itm) => historyIds.includes(Number(itm)))

    if (validItems.length > 0) {
      for (const vitem of validItems) {
        await CollectionPostLink.create(
          {
            collectionId: collectionRow.id,
            postId: vitem,
          },
          { transaction: t },
        )
      }
      await t.commit()
      createdCollection = await Collection.findOne({
        where: { id: collectionRow.id },
        include: [{ model: User, attributes: ['displayName', 'mention'], include: [Image] }, Image],
      })
      return res.status(201).send(createdCollection)
    }
    await t.rollback()
    return res.status(400).send('your collection items included an item that is not valid')
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

controller.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('an id is required')

    const collection = await Collection.findOne({ where: { id }, attributes: ['id', 'userId'] })

    if (collection.userId !== req.session.user.id) {
      return res.status(400).send('only the owner of a collection can delete a collection')
    }

    await collection.destroy()

    return res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

controller.removeCollectionItem = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('an id is required')

    const collectionItem = await CollectionPostLink.findOne({
      where: { id },
      attributes: ['id'],
      include: [{ model: Collection, attributes: ['userId'] }],
    })

    if (collectionItem.collection.userId !== req.session.user.id) {
      return res.status(400).send('only the owner of a collection item can remove a collection item')
    }

    await collectionItem.destroy()

    return res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
