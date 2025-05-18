import path from 'node:path'
import { Op } from 'sequelize'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import config from '../config'
import UserState from '../constants/UserState'
import Models from '../database/models'
import followService from '../services/FollowService'
import notificationService from '../services/NotificationService'

const { User, Image, Post, Follow, Collection, CollectionPostLink, sequelize } = Models
const { contentRoot, app } = config
const { maxProfileBioLength, maxDisplayNameLength } = app
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
      where: { mention, verified: true, state: { [Op.ne]: UserState.Banned } },
      include: [{ model: Image, attributes: ['reference'] }],
      raw: true,
      nest: true,
    })

    if (!userRow) return res.status(400).send('user does not exist')

    let isFollowed = false
    // if authenticated and looking at a profile
    if (req.cookies.user && userRow) {
      const viewingUser = JSON.parse(req.cookies.user)
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
      where: { id: req.session.user.id, verified: true },
      include: [Image],
    })
    if (displayName) userRow.displayName = displayName.slice(0, maxDisplayNameLength)
    if (bio) userRow.bio = bio.slice(0, maxProfileBioLength)

    if (includesImage) {
      const { image } = req.files

      if (image) {
        const reference = `/profile/${uuidv4().replace(/-/gi, '')}.webp`

        const fileContent = Buffer.from(image.data)
        const sharpInstance = sharp(fileContent)
        const metadata = await sharpInstance.metadata()
        sharpInstance
          .clone()
          .rotate()
          .webp({ quality: 70 })
          .withMetadata()
          .toFile(path.join(contentRoot, '/images', reference))

        const imageRow = await Image.create({
          userId: req.session.user.id,
          reference,
          width: metadata.width,
          height: metadata.height,
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
        isAdmin: req.session.admin,
      }),
      { sameSite: 'strict' },
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
      attributes: ['id', 'title', 'nsfw'],
      include: [{ model: Image, attributes: ['reference', 'latitude', 'longitude'] }],
    })
    res.status(200).send(history)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets the current sessions users collections
 */
controller.getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', 'desc']],
      attributes: ['id', 'title', 'public'],
      include: [
        { model: Image, attributes: ['reference'] },
        { model: CollectionPostLink, include: [{ model: Post, include: [Image] }] },
      ],
    })
    res.status(200).send(collections)
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
      attributes: ['id'],
      where: { mention, verified: true, state: { [Op.ne]: UserState.Banned } },
    })

    if (!userRow) {
      return res.status(400).send('No user by that mention exists.')
    }

    const isFollowing = await followService.isFollowingUser(req.session.user, userRow.id)

    let whereStatement = { userId: userRow.id, public: true }
    if (isFollowing) {
      whereStatement = {
        userId: userRow.id,
        [Op.or]: [{ public: true }, { public: false }],
      }
    }
    const posts = await Post.findAll({
      where: whereStatement,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: Image,
          attributes: ['reference', 'latitude', 'longitude'],
        },
      ],
    })
    res.status(200).send(posts)
  } catch (err) {
    next(err)
  }
}

/**
 * Gets the mention referenced users collections
 */
controller.getMentionCollections = async (req, res, next) => {
  try {
    const { mention } = req.query
    if (!mention) return res.status(400).send('a mention is required')

    const userRow = await User.findOne({
      attributes: ['id'],
      where: { mention, verified: true, state: { [Op.ne]: UserState.Banned } },
    })

    if (!userRow) {
      return res.status(400).send('No user by that mention exists.')
    }

    const isFollowing = await followService.isFollowingUser(req.session.user, userRow.id)

    let whereStatement = { userId: userRow.id, public: true }
    if (isFollowing) {
      whereStatement = {
        userId: userRow.id,
        [Op.or]: [{ public: true }, { public: false }],
      }
    }

    const collections = await Collection.findAll({
      where: whereStatement,
      order: [['createdAt', 'desc']],
      attributes: ['id', 'title', 'public'],
      include: [
        { model: Image, attributes: ['reference'] },
        { model: CollectionPostLink, include: [{ model: Post, include: [Image] }] },
      ],
    })

    res.status(200).send(collections)
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
      where: { mention, verified: true },
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
      notificationService.createFollowNotification(req.session.user.id, mentionUser.id, follow.id)
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
          verified: true,
        },
        raw: true,
      })
      userId = user.id
    }

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
          verified: true,
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

export default controller
