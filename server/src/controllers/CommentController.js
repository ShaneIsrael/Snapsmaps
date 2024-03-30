const Models = require('../database/models')

const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

controller.create = async (req, res, next) => {
  try {
    const { postId, body } = req.body
    if (!postId) return res.status(400).send('a post id is required')

    const comment = await Models.postComment.create({
      userId: req.user.id,
      postId,
      body,
    })

    res.status(200).send(comment)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
