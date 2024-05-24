const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const Models = require('../database/models')
const { User, Image } = Models
const { isValidEmail } = require('../utils')
const { Op } = require('sequelize')
const logger = require('../utils/logger')
const { sendVerificationEmail } = require('../services/EmailService')
const { UserState } = require('../constants/UserState')
const { admins } = require('../config')
const { maxDisplayNameLength, maxMentionLength, maxPasswordLength } = require('../config').app

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

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
    if (displayName.length > maxDisplayNameLength)
      return res
        .status(400)
        .send({ field: 'displayName', message: `Display name must be less than ${maxDisplayNameLength} characters` })
    if (mention.length < 4)
      return res.status(400).send({ field: 'mention', message: 'mention must be at least 4 characters.' })
    if (mention.length > maxMentionLength)
      return res
        .status(400)
        .send({ field: 'mention', message: `mention must be less than ${maxMentionLength} characters.` })
    if (mention.match(/\s/))
      return res.status(400).send({ field: 'mention', message: 'No spaces in mention names allowed.' })
    if (mention.match(/\@/))
      return res.status(400).send({ field: 'mention', message: 'No @ symbol in mention names allowed.' })
    const match = mention.match(/[A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?/)
    if (!match || match[0] !== mention)
      return res
        .status(400)
        .send({ field: 'mention', message: 'Only letters, numbers, periods, and underscores allowed.' })
    if (password.length < 5)
      return res.status(400).send({ field: 'password', message: 'Password must be at least 5 characters.' })
    if (password.length > maxPasswordLength)
      return res
        .status(400)
        .send({ field: 'password', message: `Password must be less than ${maxPasswordLength} characters.` })

    const userLookup = await User.findOne({
      attributes: { include: ['email'] },
      where: { [Op.or]: { email, mention } },
    })

    if (userLookup && userLookup.email === email.toLowerCase())
      return res.status(409).send({ field: 'email', message: 'An account with that e-mail already exists.' })
    if (userLookup && userLookup.mention === mention)
      return res
        .status(409)
        .send({ field: 'mention', message: 'That mention has already been taken, please try another.' })

    logger.info(`registering user with email: ${email.toLowerCase()}`)

    const t = await Models.sequelize.transaction()
    try {
      const token = uuidv4()
      await User.create(
        {
          email: email.toLowerCase(),
          mention,
          displayName,
          password,
          token: isProduction ? token : null,
          verified: isProduction ? false : true,
        },
        { transaction: t },
      )

      if (isProduction) {
        await sendVerificationEmail(email.toLowerCase(), token, displayName)
      }
      await t.commit()

      return res
        .status(201)
        .send(
          isProduction
            ? 'An account verification email has been sent to that address. Please check your spam folder.'
            : 'Account created successfully, you can now login.',
        )
    } catch (err) {
      await t.rollback()
      throw new Error('Unable to create account, please try again later.')
    }
  } catch (err) {
    next(err)
  }
}

controller.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) return res.status(400).send('Email & Password required.')

    const user = await User.scope('withPassword').findOne({ where: { email }, include: [Image] })

    if (user) {
      if (!user.verified) {
        return res.status(401).send('Awaiting email verification.')
      }

      if (await bcrypt.compare(password, user.password)) {
        if (user.state === UserState.Banned) {
          return res.status(401).send('Account has been banned.')
        }
        req.session.admin = admins.includes(user.email)
        req.session.user = user
        // req.session.cookie.expires = false
        req.session.cookie.maxAge = new Date(253402300799999).getTime() // Basically, never expire ever.
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
              followersCount: user.followersCount,
              followingCount: user.followingCount,
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

controller.verifyEmail = async (req, res, next) => {
  try {
    const email = req.params.email
    const token = req.params.token

    logger.info(`verifying email for: ${email.toLowerCase()}`)

    if (!email || !token) {
      return res.status(400).send('Invalid verification link')
    }

    const user = await User.findOne({ where: { email, token } })

    if (!user) {
      return res.status(400).send('Invalid verification link')
    }

    user.verified = true
    user.token = null
    user.save()

    return res.status(200).send('verified!')
  } catch (err) {
    next(err)
  }
}

controller.hasSession = async (req, res, next) => {
  try {
    if (!req.session.user) return res.status(200).send(false)
    else {
      res.cookie(
        'user',
        JSON.stringify({
          email: req.session.user.email,
          mention: req.session.user.mention,
          displayName: req.session.user.displayName,
          bio: req.session.user.bio,
          image: req.session.user.image,
          followersCount: req.session.user.followersCount,
          followingCount: req.session.user.followingCount,
          isAdmin: req.session.admin,
        }),
        { sameSite: 'strict' },
      )
      res.status(200).send({
        email: req.session.user.email,
        mention: req.session.user.mention,
        displayName: req.session.user.displayName,
        bio: req.session.user.bio,
        image: req.session.user.image,
        followersCount: req.session.user.followersCount,
        followingCount: req.session.user.followingCount,
        isAdmin: req.session.admin,
      })
    }
  } catch (err) {
    next(err)
  }
}

controller.logout = async (req, res, next) => {
  req.session.destroy(() => logger.info(`User ${req.session?.user?.mention} has logged out.`))
  res.clearCookie('user')
  return res.status(200).json({ message: 'Successfully logged out!' })
}

module.exports = controller
