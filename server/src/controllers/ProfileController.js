const path = require('path')
const Models = require('../database/models')
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

    const userRow = await Models.user.findOne({
      where: { id: req.user.id },
      include: [Models.image],
    })
    if (displayName) userRow.displayName = displayName
    if (bio) userRow.bio = bio

    if (includesImage) {
      const { image } = req.files

      if (image) {
        const reference = `${uuidv4().replace(/-/gi, '')}${image.name.substring(image.name.lastIndexOf('.'))}`

        if (!isProduction) {
          image.mv(path.join(process.cwd(), '/images', reference))
        } else {
          const fileContent = Buffer.from(image.data)
          await uploadImage(fileContent, reference, 'profile', image.mimetype)
        }

        const imageRow = await Models.image.create({
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
controller.postHistory = async (req, res, next) => {
  try {
    const history = await Models.post.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'desc']],
      attributes: ['id'],
      include: [{ model: Models.image, attributes: ['reference'] }],
    })
    res.status(200).send(history)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
