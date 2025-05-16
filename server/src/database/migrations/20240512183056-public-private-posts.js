export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('posts', 'public', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('posts', 'public')
  },
}
