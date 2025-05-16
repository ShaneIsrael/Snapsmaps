export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('postComments', 'body', {
      type: Sequelize.TEXT,
      allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('postComments', 'body', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },
}
