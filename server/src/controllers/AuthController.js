const bcrypt = require('bcryptjs')
const Models = require('../database/models')
const { isValidEmail, signUserJwt } = require('../utils')
const { Op } = require('sequelize')
const logger = require('../utils/logger')
const { isAuthenticated } = require('../middleware/authorize')

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

const COOKIE_PARAMS = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'Strict',
  secure: true,
}

controller.register = async (req, res, next) => {
  try {
    const { email, mention, displayName, password } = req.body

    if (!email) return res.status(400).send({ field: 'email', message: 'Email is required.' })
    if (!mention) return res.status(400).send({ field: 'mention', message: 'Mention is required.' })
    if (!displayName) return res.status(400).send({ field: 'displayName', message: 'Display name is required.' })
    if (!password) return res.status(400).send({ field: 'password', message: 'Password is required.' })

    if (!isValidEmail(email)) return res.status(400).send({ field: 'email', message: 'Invalid email format.' })

    if (displayName.length < 5)
      return res.status(400).send({ field: 'displayName', message: 'Display name must be at least 5 characters.' })
    if (displayName.length > 32)
      return res.status(400).send({ field: 'displayName', message: 'Display name must be less than 32 characters' })
    if (mention.length < 4)
      return res.status(400).send({ field: 'mention', message: 'mention must be at least 4 characters.' })
    if (mention.length > 16)
      return res.status(400).send({ field: 'mention', message: 'mention must be less than 16 characters.' })
    if (mention.match(/[A-Z]/))
      return res
        .status(400)
        .send({ field: 'mention', message: 'Only lowercase letters, numbers, and underscores allowed.' })
    if (!mention.match(/^\w+/))
      return res
        .status(400)
        .send({ field: 'mention', message: 'Only lowercase letters, numbers, and underscores allowed.' })
    if (password.length < 5)
      return res.status(400).send({ field: 'password', message: 'Password must be at least 5 characters.' })

    const userLookup = await Models.user.findOne({ where: { [Op.or]: { email, mention } } })

    if (userLookup && userLookup.email === email.toLowerCase())
      return res.status(409).send({ field: 'email', message: 'An account with that e-mail already exists.' })
    if (userLookup && userLookup.mention === mention)
      return res
        .status(409)
        .send({ field: 'mention', message: 'That mention has already been taken, please try another.' })

    logger.info(`registering user with email: ${email.toLowerCase()}`)

    try {
      await Models.user.create({
        email: email.toLowerCase(),
        mention,
        displayName,
        password,
        verified: true,
      })
      return res.status(200).send('Account created successfully, you can now login.')
    } catch (err) {
      res.status(500).send('Unable to create account, please try again later.')
      next(err)
    }
  } catch (err) {
    next(err)
  }
}

controller.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) return res.status(400).send('Email & Password required.')

    const user = await Models.user.scope('withPassword').findOne({ where: { email }, include: [Models.image] })

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = signUserJwt(
          user.id,
          user.email,
          user.displayName,
          user.mention,
          user.bio,
          user.image?.reference,
        )

        res.cookie('session', accessToken, COOKIE_PARAMS)

        logger.info(`logging in user with email: ${user.email}`)
        return res
          .cookie(
            'user',
            JSON.stringify({
              email: user.email,
              mention: user.mention,
              displayName: user.displayName,
              bio: user.bio,
              image: user.image?.reference,
            }),
          )
          .sendStatus(200)
      }
    }

    return res.status(400).send('Invalid email or password.')
  } catch (err) {
    next(err)
  }
}

controller.hasSession = async (req, res, next) => {
  try {
    const hasSession = isAuthenticated(req.cookies.session)
    return res.status(200).send(hasSession)
  } catch (err) {
    next(err)
  }
}

controller.logout = async (req, res, next) => {
  res.clearCookie('user')
  res.clearCookie('session')
  return res.status(200).json({ message: 'Successfully logged out!' })
}

module.exports = controller
