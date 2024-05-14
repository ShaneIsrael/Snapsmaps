'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'state', {
      type: Sequelize.ENUM,
      values: ['active', 'locked', 'banned'],
      defaultValue: 'active',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'state')
  },
}
