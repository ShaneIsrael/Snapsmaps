export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('posts', 'title', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('posts', 'title', {
      type: Sequelize.TEXT,
      allowNull: false,
    })
  },
}
