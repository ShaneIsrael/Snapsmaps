export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'deletedAt', { allowNull: true, type: Sequelize.DATE })
    await queryInterface.addColumn('posts', 'deletedAt', { allowNull: true, type: Sequelize.DATE })
    await queryInterface.addColumn('images', 'deletedAt', { allowNull: true, type: Sequelize.DATE })
    await queryInterface.addColumn('postComments', 'deletedAt', { allowNull: true, type: Sequelize.DATE })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'deletedAt')
    await queryInterface.removeColumn('posts', 'deletedAt')
    await queryInterface.removeColumn('images', 'deletedAt')
    await queryInterface.removeColumn('postComments', 'deletedAt')
  },
}
