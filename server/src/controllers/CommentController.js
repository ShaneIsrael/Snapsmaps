const Models = require('../database/models')
const { createPostCommentNotifications } = require('../services/NotificationService')
const { PostComment } = Models
const isProduction = process.env.NODE_ENV === 'production'
const { maxPostCommentLength } = require('../config').app
const controller = {}

controller.create = async (req, res, next) => {
  try {
    const { postId, body } = req.body
    if (!postId) return res.status(400).send('a post id is required')
    if (typeof body !== 'string') return res.status(400).send('body must be a string')

    const comment = await PostComment.create({
      userId: req.session.user.id,
      postId,
      body: body.slice(0, maxPostCommentLength),
    })

    createPostCommentNotifications(req.session.user.id, postId, comment.id)

    res.status(201).send(comment)
  } catch (err) {
    next(err)
  }
}

controller.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).send('an id is required')

    const comment = await PostComment.findOne({ where: { id }, attributes: ['id', 'userId', 'postId'] })

    if (comment.userId !== req.session.user.id) {
      return res.status(400).send('only the owner can delete a comment')
    }

    await comment.destroy()

    return res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
