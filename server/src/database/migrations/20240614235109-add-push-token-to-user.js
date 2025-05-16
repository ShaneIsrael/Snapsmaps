export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'pushToken', {
      type: Sequelize.STRING,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'pushToken')
  },
}
