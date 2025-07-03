// migrations/add-customer-land-id-to-proposal.js
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('proposal', 'customer_land_id', {
      type: DataTypes.STRING(10),
      allowNull: true, // Initially allow null for existing records
      references: {
        model: 'customer_land',
        key: 'customer_land_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('proposal', 'customer_land_id');
  }
};
