const { Op } = require('sequelize')
const Models = require('../database/models')
const { UserState } = require('../constants/UserState')
const { Post, PostComment, User, Image, Follow, PostLike, sequelize } = Models

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

// make sure you update PAGE_SIZE on the frontend as well
const PAGE_SIZE = 5

controller.public = async (req, res, next) => {
  try {
    const { lastDate } = req.query

    const include = [
      { model: User, attributes: ['displayName', 'mention'], include: [Image] },
      Image,
      { model: PostComment, include: [{ model: User, include: [Image] }] },
    ]
    const orQuery = [{ public: true }]
    if (req.session.user) {
      orQuery.push({ userId: req.session.user.id })
      include.push({ model: PostLike, where: { userId: req.session?.user?.id }, required: false })
    }
    const bannedUserIds = (
      await User.findAll({
        attributes: ['id'],
        where: {
          state: UserState.Banned,
        },
        raw: true,
      })
    ).map((u) => u.id)

    const posts = await Post.findAll({
      where: {
        userId: { [Op.notIn]: bannedUserIds },
        [Op.or]: orQuery,
        createdAt: {
          [Op.lt]: lastDate || sequelize.fn('NOW'),
        },
      },
      order: [
        ['createdAt', 'desc'],
        [PostComment, 'createdAt', 'asc'],
      ],
      include,
      limit: PAGE_SIZE,
    })
    res.status(200).send(posts)
  } catch (err) {
    next(err)
  }
}

controller.following = async (req, res, next) => {
  try {
    const { lastDate } = req.query
    const { id } = req.session.user
    const following = await Follow.findAll({
      where: {
        followingUserId: id,
      },
      include: [{ model: User, as: 'followed' }],
    })

    const followingIds = following.map((follow) => follow.followed.id)
    followingIds.push(req.session.user.id)

    const bannedUserIds = (
      await User.findAll({
        attributes: ['id'],
        where: {
          state: UserState.Banned,
        },
        raw: true,
      })
    ).map((u) => u.id)

    const posts = await Post.findAll({
      where: {
        userId: {
          [Op.in]: followingIds,
          [Op.notIn]: bannedUserIds,
        },
        createdAt: {
          [Op.lt]: lastDate || sequelize.fn('NOW'),
        },
      },
      order: [
        ['createdAt', 'desc'],
        [PostComment, 'createdAt', 'asc'],
      ],
      include: [
        {
          model: User,
          attributes: ['displayName', 'mention'],
          include: [Image],
        },
        Image,
        { model: PostComment, include: [{ model: User, include: [Image] }] },
        { model: PostLike, where: { userId: req.session?.user?.id }, required: false },
      ],
      limit: PAGE_SIZE,
    })
    res.status(200).send(posts)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
