'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Post, PostComment, Follow } = models
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      })
      this.belongsTo(User, {
        foreignKey: 'fromUserId',
        as: 'fromUser',
      })
      this.belongsTo(Post)
      this.belongsTo(PostComment)
      this.belongsTo(Follow)
    }
  }
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.user, key: 'id' },
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: sequelize.models.user, key: 'id' },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: sequelize.models.post, key: 'id' },
      },
      postCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: sequelize.models.postComment, key: 'id' },
      },
      followId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: sequelize.models.follow, key: 'id' },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
      modelName: 'notification',
      sequelize,
    },
  )
  return Notification
}
