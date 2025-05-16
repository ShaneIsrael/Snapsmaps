import * as bcrypt from 'bcryptjs'
import { Model } from 'sequelize'
import UserState from '../../constants/UserState'
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Post, Image, PostComment, PostLike, Follow, Notification } = models
      User.hasMany(Post, { onDelete: 'CASCADE', hooks: true })
      User.hasMany(PostComment, { onDelete: 'CASCADE', hooks: true })
      User.hasMany(PostLike, { onDelete: 'CASCADE', hooks: true })
      User.hasMany(Follow, { onDelete: 'CASCADE', hooks: true, foreignKey: 'followingUserId', as: 'follower' })
      User.hasMany(Follow, { onDelete: 'CASCADE', hooks: true, foreignKey: 'followedUserId', as: 'followed' })
      User.belongsTo(Image, { onDelete: 'CASCADE', hooks: true })
      User.hasMany(Notification, { onDelete: 'CASCADE', hooks: true, foreignKey: 'userId', as: 'user' })
      User.hasMany(Notification, { onDelete: 'CASCADE', hooks: true, foreignKey: 'fromUserId', as: 'fromUser' })
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
      state: {
        type: DataTypes.ENUM,
        values: Object.values(UserState),
        defaultValue: UserState.Active,
      },
    },
    {
      hooks: {
        afterUpdate: (user) => {
          if (user.state === UserState.Banned) {
            sequelize.models.Sessions.destroy({ where: { userId: user.id } })
          }
        },
      },
      sequelize,
      paranoid: true,
      modelName: 'user',
      defaultScope: {
        attributes: {
          exclude: ['email', 'password', 'token', 'verified', 'state'],
        },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ['password', 'state'],
          },
        },
        withState: {
          attributes: {
            include: ['state'],
          },
        },
        withVerified: {
          attributes: {
            include: ['verified'],
          },
        },
      },
    },
  )
  return User
}
