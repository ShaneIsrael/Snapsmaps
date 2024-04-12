const Models = require('../database/models')
const { Post, PostComment, User, Image } = Models

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

controller.public = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      order: [
        ['createdAt', 'desc'],
        [PostComment, 'createdAt', 'asc'],
      ],
      include: [
        { model: User, attributes: ['displayName', 'mention'], include: [Image] },
        Image,
        { model: PostComment, include: [{ model: User, include: [Image] }] },
      ],
    })
    res.status(200).send(posts)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
