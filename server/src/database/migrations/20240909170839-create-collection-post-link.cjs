module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('collectionPostLinks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      collectionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      postId: {
        allowNulL: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('collectionPostLinks')
  },
}
