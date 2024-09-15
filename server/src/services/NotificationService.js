const isProduction = process.env.NODE_ENV === 'production'
const { Op } = require('sequelize')
const logger = require('../utils/logger')
const Models = require('../database/models')
const { Follow, Notification, Post, User, PostComment, Sessions, Image } = Models
const admin = require('firebase-admin')
const { production, development } = require('../config')
const serviceAccount = isProduction ? production.firebase : development.firebase

if (isProduction) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const service = {}

service.createPostNotifications = async (fromUserId, postId, body) => {
  try {
    const fromUser = await User.findOne({ where: { id: fromUserId }, include: [Image] })
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
    follows.forEach((follow) => {
      sendPushNotification(follow.follower.id, fromUser, `${fromUser.displayName} posted a new Snapmap.`)
    })
  } catch (err) {
    logger.error(err)
  }
}

service.createPostCommentNotifications = async (fromUserId, postId, postCommentId) => {
  try {
    const forUser = await Post.findOne({ where: { id: postId }, attributes: ['userId'], raw: true })
    const fromUserComment = await PostComment.findOne({
      where: {
        id: postCommentId,
      },
      include: [{ model: User, include: [Image] }],
    })

    if (forUser) {
      // Dont create notifications for yourself
      if (fromUserId !== forUser.userId) {
        await Notification.create({
          userId: forUser.userId,
          fromUserId,
          postId,
          postCommentId,
        })
        sendPushNotification(
          forUser.userId,
          fromUserComment.user,
          `${fromUserComment.user.displayName} replied`,
          fromUserComment.body,
        )
      }
    }
  } catch (err) {
    logger.error(err)
  }
}

service.createPostDiscussionNotifications = async (fromUserId, postId, postCommentId, body) => {
  try {
    const fromUserComment = await PostComment.findOne({
      where: {
        id: postCommentId,
      },
      include: [{ model: User, include: [Image] }],
    })
    const post = await Post.findOne({ where: { id: postId }, attributes: ['userId'], raw: true })

    // Send to all users who commented on the post (excluding post creator)
    const forUsers = await PostComment.findAll({
      attributes: ['userId'],
      group: ['userId'],
      where: {
        postId,
        userId: {
          [Op.notIn]: [fromUserId, post.userId],
        },
      },
      raw: true,
    })

    if (forUsers) {
      forUsers.forEach(({ userId }) => {
        Notification.create({
          userId,
          fromUserId,
          postId,
          postCommentId,
          body,
          title: 'said...',
        })
        sendPushNotification(
          userId,
          fromUserComment.user,
          `${fromUserComment.user.displayName} said...`,
          fromUserComment.body,
        )
      })
    }
  } catch (err) {
    logger.error(err)
  }
}

service.createFollowNotification = async (fromUserId, forUserId, followId) => {
  try {
    const fromUser = await User.findOne({ where: { id: fromUserId }, include: [Image] })
    // Dont create notifications for yourself
    if (fromUserId !== forUserId) {
      await Notification.create({
        userId: forUserId,
        fromUserId,
        followId,
      })
      sendPushNotification(forUserId, fromUser, `${fromUser.displayName} followed you.`)
    }
  } catch (err) {
    logger.error(err)
  }
}

function sendPushNotification(userId, fromUser, title, body, link) {
  if (isProduction) {
    Sessions.findAll({ where: { userId, fcmToken: { [Op.ne]: null } }, attributes: ['fcmToken'] }).then((sessions) => {
      const messages = sessions.map((session) => ({
        data: {
          title: title || '',
          body: body || '',
          badge: fromUser.image?.reference || '',
        },
        token: session.fcmToken,
      }))
      messages.forEach((message) => admin.messaging().send(message))
    })
  }
}

module.exports = service
