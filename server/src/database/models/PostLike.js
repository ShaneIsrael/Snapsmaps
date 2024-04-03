'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { user, post } = models
      this.belongsTo(user)
      this.belongsTo(post)
    }
  }
  PostLike.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.user, key: 'id' },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.post, key: 'id' },
      },
    },
    {
      hooks: {
        afterCreate: (postLike) => {
          sequelize.models.post.increment('likeCount', { by: 1, where: { id: postLike.postId } })
        },
        afterDestroy: (postLike) => {
          sequelize.models.post.decrement('likeCount', { by: 1, where: { id: postLike.postId } })
        },
      },
      modelName: 'postLike',
      sequelize,
    },
  )
  return PostLike
}
