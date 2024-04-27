const { Model } = require('sequelize')
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Post, Image, PostComment, PostLike, Follow, Notification } = models
      this.hasMany(Post, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(PostComment, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(PostLike, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(Follow, { onDelete: 'CASCADE', hooks: true, foreignKey: 'followingUserId', as: 'follower' })
      this.hasMany(Follow, { onDelete: 'CASCADE', hooks: true, foreignKey: 'followedUserId', as: 'followed' })
      this.belongsTo(Image, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(Notification, { onDelete: 'CASCADE', hooks: true, foreignKey: 'userId', as: 'user' })
      this.hasMany(Notification, { onDelete: 'CASCADE', hooks: true, foreignKey: 'fromUserId', as: 'fromUser' })
    }
  }
  User.init(
    {
      imageId: {
        type: DataTypes.INTEGER,
        references: { model: sequelize.models.image, key: 'id' },
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      mention: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
        unique: true,
      },
      followingCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      followersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bio: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('password', bcrypt.hashSync(value, 10))
        },
        validate: {
          notEmpty: true,
        },
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      token: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'user',
      defaultScope: {
        attributes: {
          exclude: ['email', 'password', 'token', 'verified'],
        },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ['password'],
          },
        },
      },
    },
  )
  return User
}
