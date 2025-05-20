module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'followingCount', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
    await queryInterface.addColumn('users', 'followersCount', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'followingCount')
    await queryInterface.removeColumn('users', 'followersCount')
  },
}
