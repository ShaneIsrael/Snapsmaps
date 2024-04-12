'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User } = models
      this.belongsTo(User, {
        foreignKey: 'followingUserId',
      })
      this.belongsTo(User, {
        foreignKey: 'followedUserId',
      })
    }
  }
  Follow.init(
    {
      followingUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.user, key: 'id' },
      },
      followedUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.user, key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'follow',
    },
  )
  return Follow
}
