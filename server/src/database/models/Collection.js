'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { User, Image, CollectionPostLink } = models
      this.hasMany(CollectionPostLink, { onDelete: 'cascade', hooks: true })
      this.belongsTo(User)
      this.belongsTo(Image)
    }
  }
  Collection.init(
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
      public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'collection',
      defaultScope: {
        attributes: {
          exclude: ['userId', 'imageId'],
        },
      },
    },
  )
  return Collection
}
