import Models from '../database/models'
import logger from '../utils/logger'
const { Follow } = Models
const service = {}

service.isFollowingUser = async (sessionUser, targetUserId) => {
  try {
    if (!sessionUser) return false

    const follow = await Follow.findOne({
      where: { followingUserId: sessionUser.id, followedUserId: targetUserId },
    })
    return !!follow
  } catch (err) {
    logger.error(err)
  }
  return false
}

export default service
