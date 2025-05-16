import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User } = models
      Follow.belongsTo(User, {
        foreignKey: 'followingUserId',
        as: 'follower',
      })
      Follow.belongsTo(User, {
        foreignKey: 'followedUserId',
        as: 'followed',
      })
    }
  }
  Follow.init(
    {
      followingUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.User, key: 'id' },
      },
      followedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.User, key: 'id' },
      },
    },
    {
      hooks: {
        afterCreate: (follow) => {
          sequelize.models.user.increment('followingCount', { by: 1, where: { id: follow.followingUserId } })
          sequelize.models.user.increment('followersCount', { by: 1, where: { id: follow.followedUserId } })
        },
        afterDestroy: (follow) => {
          sequelize.models.user.decrement('followingCount', { by: 1, where: { id: follow.followingUserId } })
          sequelize.models.user.decrement('followersCount', { by: 1, where: { id: follow.followedUserId } })
        },
      },

      sequelize,
      modelName: 'follow',
    },
  )
  return Follow
}
