import config from '../config'
import UserState from '../constants/UserState'
import Models from '../database/models'
const { User, Post, PostComment } = Models
const controller = {}

const { admins } = config

controller.deletePost = async (req, res, next) => {
  const { id } = req.query
  try {
    const post = await Post.findByPk(id)
    if (post) {
      post.destroy()
      return res.sendStatus(200)
    }
    return res.sendStatus(400)
  } catch (err) {
    next(err)
  }
}
controller.deleteComment = async (req, res, next) => {
  const { id } = req.query
  try {
    const comment = await PostComment.findByPk(id)
    if (comment) {
      comment.destroy()
      return res.sendStatus(200)
    }
    return res.sendStatus(400)
  } catch (err) {
    next(err)
  }
}
controller.banUser = async (req, res, next) => {
  const { mention } = req.body
  try {
    const user = await User.findOne({ where: { mention } })
    if (user) {
      if (admins.includes(user.email)) {
        return res.status(400).send('You cannot ban an admin.')
      }
      user.state = UserState.Banned
      user.save()
      return res.sendStatus(200)
    }
    return res.sendStatus(400)
  } catch (err) {
    next(err)
  }
}
controller.markPostNsfw = async (req, res, next) => {
  const { id } = req.body
  try {
    const post = await Post.findByPk(id)
    if (post) {
      post.nsfw = true
      post.save()
      return res.sendStatus(200)
    }
    return res.sendStatus(400)
  } catch (err) {
    next(err)
  }
}
controller.hardDestroyImage = async (req, res, next) => {}

export default controller
