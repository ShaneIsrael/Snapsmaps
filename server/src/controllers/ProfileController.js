const path = require('path')
const Models = require('../database/models')
const { v4: uuidv4 } = require('uuid')
const { signUserJwt } = require('../utils')

const isProduction = process.env.NODE_ENV === 'production'

const COOKIE_PARAMS = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'Strict',
  secure: true,
}

const controller = {}

controller.update = async (req, res, next) => {
  try {
    const { displayName, mention, bio, includesImage } = req.body

    if (!displayName && !mention && !bio) {
      return res.status(400).send('no profile data provided')
    }

    const userRow = await Models.user.findOne({
      where: { id: req.user.id },
      include: [Models.image],
    })
    if (displayName) userRow.displayName = displayName
    if (mention) userRow.mention = mention
    if (bio) userRow.bio = bio

    if (includesImage) {
      const { image } = req.files

      if (image) {
        const reference = `profile_${uuidv4().replace(/-/gi, '')}${image.name.substring(image.name.lastIndexOf('.'))}`

        if (!isProduction) {
          image.mv(path.join(process.cwd(), '/images', reference))
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

module.exports = controller
