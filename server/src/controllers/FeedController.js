const { Op } = require('sequelize')
const Models = require('../database/models')
const { Post, PostComment, User, Image, Follow, sequelize } = Models

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

// make sure you update PAGE_SIZE on the frontend as well
const PAGE_SIZE = 5

controller.public = async (req, res, next) => {
  try {
    const { lastDate } = req.query

    const posts = await Post.findAll({
      where: {
        createdAt: {
          [Op.lt]: lastDate || sequelize.fn('NOW'),
        },
      },
      order: [
        ['createdAt', 'desc'],
        [PostComment, 'createdAt', 'asc'],
      ],
      include: [
        { model: User, attributes: ['displayName', 'mention'], include: [Image] },
        Image,
        { model: PostComment, include: [{ model: User, include: [Image] }] },
      ],
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
    const { id } = req.user
    const following = await Follow.findAll({
      where: {
        followingUserId: id,
      },
      include: [{ model: User, as: 'followed' }],
    })

    const followingIds = following.map((follow) => follow.followed.id)
    followingIds.push(req.user.id)

    const posts = await Post.findAll({
      where: {
        userId: {
          [Op.in]: followingIds,
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
        { model: User, attributes: ['displayName', 'mention'], include: [Image] },
        Image,
        { model: PostComment, include: [{ model: User, include: [Image] }] },
      ],
      limit: PAGE_SIZE,
    })
    res.status(200).send(posts)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
