import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // define association here
      const { User } = models
      Session.belongsTo(User)
    }
  }
  Session.init(
    {
      sid: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      expires: DataTypes.DATE,
      data: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      fcmToken: DataTypes.STRING,
    },
    {
      modelName: 'Sessions',
      sequelize,
    },
  )
  return Session
}
