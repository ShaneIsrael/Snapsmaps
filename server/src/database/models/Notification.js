import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Post, PostComment, Follow } = models
      Notification.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      })
      Notification.belongsTo(User, {
        foreignKey: 'fromUserId',
        as: 'fromUser',
      })
      Notification.belongsTo(Post)
      Notification.belongsTo(PostComment)
      Notification.belongsTo(Follow)
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
