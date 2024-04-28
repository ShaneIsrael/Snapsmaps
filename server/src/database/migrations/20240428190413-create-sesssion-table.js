'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      sid: {
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      expires: Sequelize.DATE,
      data: Sequelize.TEXT,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sessions')
  },
}
