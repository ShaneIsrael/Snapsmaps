const { Op } = require('sequelize')
const Models = require('../database/models')
const { UserState } = require('../constants/UserState')
const { User, Image, Notification, Post, PostComment, Follow } = Models

const controller = {}

const PAGE_SIZE = 10

controller.search = async (req, res, next) => {
  try {
    const { page, query } = req.query
    const users = await User.findAll({
      attributes: ['displayName', 'mention', 'bio'],
      where: {
        verified: true,
        state: { [Op.ne]: UserState.Banned },
        [Op.or]: {
          displayName: {
            [Op.iLike]: `%${query}%`,
          },
          mention: {
            [Op.iLike]: `%${query}%`,
          },
        },
      },
      include: [{ model: Image, attributes: ['reference'] }],
      raw: true,
      nest: true,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
    res.status(200).send(users)
  } catch (err) {
    next(err)
  }
}

controller.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        userId: req.session.user.id,
      },
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['displayName', 'mention'],
          include: [{ model: Image, attributes: ['reference'] }],
        },
        {
          model: Follow,
          attributes: ['createdAt'],
          include: [
            {
              model: User,
              as: 'follower',
              attributes: ['displayName', 'mention'],
              include: [{ model: Image, attributes: ['reference'] }],
            },
          ],
        },
        { model: Post, attributes: ['id', 'title'], include: [{ model: User, attributes: ['mention'] }] },
        { model: PostComment, attributes: ['id', 'body'] },
      ],
      attributes: ['id', 'body', 'title', 'read', 'createdAt'],
      order: [['createdAt', 'desc']],
      limit: 50,
    })
    res.status(200).send(notifications)
  } catch (err) {
    next(err)
  }
}

controller.readNotifications = async (req, res, next) => {
  try {
    await Notification.update({ read: true }, { where: { userId: req.session.user.id, read: false } })
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
