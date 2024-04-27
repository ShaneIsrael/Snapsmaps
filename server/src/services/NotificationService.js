const logger = require('../utils/logger')
const Models = require('../database/models')
const { Follow, Notification, Post, User } = Models
const service = {}

service.createPostNotifications = async (fromUserId, postId, body) => {
  try {
    const follows = await Follow.findAll({
      where: {
        followedUserId: fromUserId,
      },
      include: [{ model: User, as: 'follower', attributes: ['id'] }],
      raw: true,
      nest: true,
    })

    const bulkInsert = follows.map((follow) => ({
      userId: follow.follower.id,
      fromUserId,
      postId,
      body,
    }))
    await Notification.bulkCreate(bulkInsert)
  } catch (err) {
    logger.error(err)
  }
}

service.createPostCommentNotifications = async (fromUserId, postId, postCommentId) => {
  try {
    const forUser = await Post.findOne({ where: { id: postId }, attributes: ['userId'], raw: true })

    if (forUser) {
      // Dont create notifications for yourself
      if (fromUserId !== forUser.userId) {
        await Notification.create({
          userId: forUser.userId,
          fromUserId,
          postId,
          postCommentId,
        })
      }
    }
  } catch (err) {
    logger.error(err)
  }
}

service.createFollowNotification = async (fromUserId, forUserId, followId) => {
  try {
    // Dont create notifications for yourself
    if (fromUserId !== forUserId) {
      await Notification.create({
        userId: forUserId,
        fromUserId,
        followId,
      })
    }
  } catch (err) {
    logger.error(err)
  }
}

module.exports = service
