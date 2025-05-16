import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Post } = models
      Image.belongsTo(User)
      Image.hasOne(Post)
    }
  }
  Image.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.user, key: 'id' },
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      width: {
        type: DataTypes.INTEGER,
      },
      height: {
        type: DataTypes.INTEGER,
      },
      latitude: {
        type: DataTypes.FLOAT,
      },
      longitude: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'image',
      defaultScope: {
        attributes: {
          exclude: ['userId'],
        },
      },
    },
  )
  return Image
}
