import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Image, PostComment, PostLike } = models
      Post.hasMany(PostComment, { onDelete: 'CASCADE', hooks: true })
      Post.hasMany(PostLike, { onDelete: 'CASCADE', hooks: true })
      Post.belongsTo(User)
      Post.belongsTo(Image)
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
        allowNull: true,
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
      public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      nsfw: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
