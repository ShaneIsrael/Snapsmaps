const Models = require('../database/models')

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

controller.public = async (req, res, next) => {
  try {
    const posts = await Models.post.findAll({
      order: [
        ['createdAt', 'desc'],
        [Models.postComment, 'createdAt', 'asc'],
      ],
      include: [
        { model: Models.user, attributes: ['displayName', 'mention'], include: [Models.image] },
        Models.image,
        { model: Models.postComment, include: [{ model: Models.user, include: [Models.image] }] },
      ],
    })
    console.log(posts[0].postComments)
    res.status(200).send(posts)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
