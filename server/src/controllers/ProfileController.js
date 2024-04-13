const path = require('path')
const Models = require('../database/models')
const { User, Image, Post, Follow } = Models
const { v4: uuidv4 } = require('uuid')
const { signUserJwt } = require('../utils')
const { uploadImage } = require('../services/UploadService')

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
      where: { id: req.user.id },
      include: [{ model: Image, attributes: ['reference'] }],
      raw: true,
      nest: true,
    })
    console.log(userRow)
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
      where: { id: req.user.id },
      include: [Image],
    })
    if (displayName) userRow.displayName = displayName
    if (bio) userRow.bio = bio

    if (includesImage) {
      const { image } = req.files

      if (image) {
        const reference = `/profile/${uuidv4().replace(/-/gi, '')}${image.name.substring(image.name.lastIndexOf('.'))}`

        if (!isProduction) {
          image.mv(path.join(process.cwd(), '/images', reference))
        } else {
          const fileContent = Buffer.from(image.data)
          await uploadImage(fileContent, reference, image.mimetype)
        }

        const imageRow = await Image.create({
          userId: req.user.id,
          reference,
        })

        userRow.imageId = imageRow.id
      }
    }

    await userRow.save()
    await userRow.reload()

    const accessToken = signUserJwt(
      userRow.id,
      userRow.email,
      userRow.displayName,
      userRow.mention,
      userRow.bio,
      userRow.image?.reference,
      userRow.followersCount,
      userRow.followingCount,
    )
    res.cookie('session', accessToken, COOKIE_PARAMS)
    res.cookie(
      'user',
      JSON.stringify({
        email: userRow.email,
        mention: userRow.mention,
        displayName: userRow.displayName,
        bio: userRow.bio,
        image: userRow.image?.reference,
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
      where: { userId: req.user.id },
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
    if (mention === req.user.mention) return res.status(400).send('you cant follow yourself')

    const mentionUser = await User.findOne({
      attributes: ['id'],
      where: { mention },
    })

    if (!mentionUser) {
      return res.status(404).send('no such user exists')
    }

    const [follow, created] = await Follow.findOrCreate({
      where: { followingUserId: req.user.id, followedUserId: mentionUser.id },
      defaults: {
        followingUserId: req.user.id,
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
    if (mention === req.user.mention)
      return res.status(400).send('you must first follow yourself before you can unfollow yourself')

    const mentionUser = await User.findOne({
      attributes: ['id'],
      where: { mention },
    })

    if (!mentionUser) {
      return res.status(404).send('no such user exists')
    }

    const follow = await Follow.findOne({
      where: { followingUserId: req.user.id, followedUserId: mentionUser.id },
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

module.exports = controller
