export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'pushToken')
    await queryInterface.addColumn('Sessions', 'fcmToken', {
      type: Sequelize.STRING,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'pushToken', {
      type: Sequelize.STRING,
    })
    await queryInterface.removeColumn('Sessions', 'fcmToken')
  },
}
