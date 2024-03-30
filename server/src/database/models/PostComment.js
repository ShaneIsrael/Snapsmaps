'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PostComment extends Model {
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
  PostComment.init(
    {
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
        afterCreate: (postComment) => {
          sequelize.models.post.increment('commentCount', { by: 1, where: { id: postComment.postId } })
        },
        afterDestroy: (postComment) => {
          sequelize.models.post.decrement('commentCount', { by: 1, where: { id: postComment.postId } })
        },
      },
      sequelize,
      modelName: 'postComment',
      defaultScope: {
        attributes: {
          exclude: ['userId', 'postId'],
        },
      },
    },
  )
  return PostComment
}
