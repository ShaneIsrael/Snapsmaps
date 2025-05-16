import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class CollectionPostLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { Collection, Post } = models
      CollectionPostLink.belongsTo(Collection)
      CollectionPostLink.belongsTo(Post)
    }
  }
  CollectionPostLink.init(
    {
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.collection, key: 'id' },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: sequelize.models.post, key: 'id' },
      },
    },
    {
      modelName: 'collectionPostLink',
      sequelize,
    },
  )
  return CollectionPostLink
}
