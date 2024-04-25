const Models = require('../database/models')
const { PostLike } = Models
const isProduction = process.env.NODE_ENV === 'production'

const controller = {}

controller.likedPost = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('id of post is required')

    const liked = await PostLike.findOne({
      where: { userId: req.session.user.id, postId: id },
    })

    res.status(200).send(!!liked)
  } catch (err) {
    next(err)
  }
}

controller.likePost = async (req, res, next) => {
  try {
    const { id } = req.body
    if (!id) return res.status(400).send('id of post is required')

    const [postLike, created] = await PostLike.findOrCreate({
      where: { userId: req.session.user.id, postId: id },
      defaults: {
        userId: req.session.user.id,
        postId: id,
      },
    })

    if (created) {
      res.status(201).send(true)
    } else {
      await postLike.destroy()
      res.status(200).send(false)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = controller
