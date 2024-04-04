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
      const { post, image, postComment, postLike, follow } = models
      this.hasMany(post, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(postComment, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(postLike, { onDelete: 'CASCADE', hooks: true })
      this.hasMany(follow, { onDelete: 'CASCADE', hooks: true })
      this.belongsTo(image, { onDelete: 'CASCADE', hooks: true })
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
          exclude: ['password', 'token', 'verified'],
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
