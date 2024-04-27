const path = require('path')
const Models = require('../database/models')
const { User, Image, Post, Follow, sequelize } = Models
const { v4: uuidv4 } = require('uuid')
const { uploadImage } = require('../services/UploadService')
const sharp = require('sharp')
const { Op } = require('sequelize')

const isProduction = process.env.NODE_ENV === 'production'

const COOKIE_PARAMS = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'Strict',
  secure: true,
}

const controller = {}

controller.get = async (req, res, next) => {
  try {
    const userRow = await User.findOne({
      where: { id: req.session.user.id },
      include: [{ model: Image, attributes: ['reference'] }],
      raw: true,
      nest: true,
    })
    res.status(200).send({
      displayName: userRow.displayName,
      mention: userRow.mention,
      bio: userRow.bio,
      image: userRow.image?.reference,
      followersCount: userRow.followersCount,
      followingCount: userRow.followingCount,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Gets a users profile by their mention name
 */
controller.getByMention = async (req, res, next) => {
  try {
    const { mention } = req.query

    if (!mention) return res.status(400).send('a mention is required')

    const userRow = await User.findOne({
      where: { mention },
      include: [{ model: Image, attributes: ['reference'] }],
      raw: true,
      nest: true,
    })

    let isFollowed = false
    // if authenticated and looking at a profile
    if (req.cookies.user && userRow) {
      let viewingUser = JSON.parse(req.cookies.user)
      if (viewingUser.email) {
        const viewingUserRow = await User.findOne({ attributes: ['id'], where: { email: viewingUser.email } })
        isFollowed =
          // findAll with a limit of 1 is apparently the fastest way to search
          // and the follow table is likely to be very large.
          (
            await Follow.findAll({
              attributes: ['id'],
              limit: 1,
              where: {
                followingUserId: viewingUserRow.id,
                followedUserId: userRow.id,
              },
            })
          ).length > 0
      }
    }

    const mutatedUser = { ...userRow, image: userRow.image?.reference, isFollowed }

    res.status(200).send(mutatedUser)
  } catch (err) {
    next(err)
  }
}

/**
 * Updates users profile information. (image, displayName, bio)
 * @returns
 */
controller.update = async (req, res, next) => {
  try {
    const { displayName, bio, includesImage } = req.body

    if (!displayName && !bio) {
      return res.status(400).send('no profile data provided')
    }

    const userRow = await User.findOne({
      where: { id: req.session.user.id },
      include: [Image],
    })
    if (displayName) userRow.displayName = displayName
    if (bio) userRow.bio = bio

    if (includesImage) {
      const { image } = req.files

      if (image) {
        const reference = `/profile/${uuidv4().replace(/-/gi, '')}.webp`

        const fileContent = Buffer.from(image.data)
        if (!isProduction) {
          await sharp(fileContent)
            .rotate()
            .webp({ quality: 70 })
            .withMetadata()
            .toFile(path.join(process.cwd(), '/images', reference))
        } else {
          const compressed = await sharp(fileContent).webp({ quality: 70 }).rotate().withMetadata().toBuffer()
          await uploadImage(compressed, reference, 'image/webp')
        }

        const imageRow = await Image.create({
          userId: req.session.user.id,
          reference,
        })

        userRow.imageId = imageRow.id
      }
    }

    await userRow.save()
    await userRow.reload()

    req.session.user = userRow

    res.cookie(
      'user',
      JSON.stringify({
        email: userRow.email,
        mention: userRow.mention,
        displayName: userRow.displayName,
        bio: userRow.bio,
        image: userRow.image,
        followersCount: userRow.followersCount,
        followingCount: userRow.followingCount,
      }),
    )

    res.status(200).send(userRow)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets the current sessions users post history
 */
controller.getPostHistory = async (req, res, next) => {
  try {
    const history = await Post.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', 'desc']],
      attributes: ['id'],
      include: [{ model: Image, attributes: ['reference', 'latitude', 'longitude'] }],
    })
    res.status(200).send(history)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets the mention referenced users post history
 */
controller.getMentionPostHistory = async (req, res, next) => {
  try {
    const { mention } = req.query
    if (!mention) return res.status(400).send('a mention is required')

    const userRow = await User.findOne({
      where: { mention },
      order: [[Post, 'createdAt', 'desc']],
      include: [
        {
          model: Post,
          attributes: ['id'],
          include: [{ model: Image, attributes: ['reference', 'latitude', 'longitude'] }],
        },
      ],
    })
    res.status(200).send(userRow.posts)
  } catch (err) {
    next(err)
  }
}

controller.followProfile = async (req, res, next) => {
  try {
    const { mention } = req.body
    if (!mention) return res.status(400).send('a mention is required')
    if (mention === req.session.user.mention) return res.status(400).send('you cant follow yourself')

    const mentionUser = await User.findOne({
      attributes: ['id'],
      where: { mention },
    })

    if (!mentionUser) {
      return res.status(404).send('no such user exists')
    }

    const [follow, created] = await Follow.findOrCreate({
      where: { followingUserId: req.session.user.id, followedUserId: mentionUser.id },
      defaults: {
        followingUserId: req.session.user.id,
        followedUserId: mentionUser.id,
      },
    })

    if (created) {
      return res.status(201).send(created)
    }
    return res.status(200).send(follow)
  } catch (err) {
    next(err)
  }
}

controller.unfollowProfile = async (req, res, next) => {
  try {
    const { mention } = req.query
    if (!mention) return res.status(400).send('a mention is required')
    if (mention === req.session.user.mention)
      return res.status(400).send('you must first follow yourself before you can unfollow yourself')

    const mentionUser = await User.findOne({
      attributes: ['id'],
      where: { mention },
    })

    if (!mentionUser) {
      return res.status(404).send('no such user exists')
    }

    const follow = await Follow.findOne({
      where: { followingUserId: req.session.user.id, followedUserId: mentionUser.id },
    })
    if (follow) {
      follow.destroy()
      return res.sendStatus(200)
    }
    return res.sendStatus(404)
  } catch (err) {
    next(err)
  }
}

controller.getFollowers = async (req, res, next) => {
  const PAGE_SIZE = 25
  try {
    const { mention, lastDate } = req.query
    let userId = req.session.user?.id
    if (mention) {
      const user = await User.findOne({
        attributes: ['id'],
        where: {
          mention,
        },
        raw: true,
      })
      userId = user.id
    }
    console.log(req.session.user)

    if (!userId) return res.sendStatus(400)

    // If no mention is provided, assume getting followers for self.
    const followers = await Follow.findAll({
      where: {
        followedUserId: userId,
        createdAt: {
          [Op.lt]: lastDate || sequelize.fn('NOW'),
        },
      },
      limit: PAGE_SIZE,
      order: [['createdAt', 'desc']],
      include: [{ model: User, as: 'follower', include: [Image] }],
      raw: true,
      nest: true,
    })
    return res.status(200).send(followers)
  } catch (err) {
    next(err)
  }
}

controller.getFollowing = async (req, res, next) => {
  const PAGE_SIZE = 25
  try {
    const { mention, lastDate } = req.query
    let userId = req.session.user?.id
    if (mention) {
      const user = await User.findOne({
        attributes: ['id'],
        where: {
          mention,
        },
        raw: true,
      })
      userId = user.id
    }

    if (!userId) return res.sendStatus(400)

    // If no mention is provided, assume getting following for self.
    const followers = await Follow.findAll({
      where: {
        followingUserId: userId,
        createdAt: {
          [Op.lt]: lastDate || sequelize.fn('NOW'),
        },
      },
      limit: PAGE_SIZE,
      order: [['createdAt', 'desc']],
      include: [{ model: User, as: 'followed', include: [Image] }],
      raw: true,
      nest: true,
    })
    return res.status(200).send(followers)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
