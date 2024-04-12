'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Image, PostComment, PostLike } = models
      this.belongsTo(User)
      this.belongsTo(Image)
      this.hasMany(PostComment, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(PostLike, { onDelete: 'CASCADE', hooks: true })
    }
  }
  Post.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.user, key: 'id' },
      },
      imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.image, key: 'id' },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      commentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'post',
      defaultScope: {
        attributes: {
          exclude: ['userId', 'imageId'],
        },
      },
    },
  )
  return Post
}
