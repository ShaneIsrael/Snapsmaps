'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('collections', 'deletedAt', { allowNull: true, type: Sequelize.DATE })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('collections', 'deletedAt')
  },
}
