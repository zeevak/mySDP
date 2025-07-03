const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add status column to proposal table
    await queryInterface.addColumn('proposal', 'status', {
      type: DataTypes.STRING(20),
      defaultValue: 'Pending',
      allowNull: false
    });

    // Add timestamps to proposal table if they don't exist
    try {
      await queryInterface.addColumn('proposal', 'created_at', {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      });
    } catch (error) {
      console.log('created_at column already exists');
    }

    try {
      await queryInterface.addColumn('proposal', 'updated_at', {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      });
    } catch (error) {
      console.log('updated_at column already exists');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('proposal', 'status');
    await queryInterface.removeColumn('proposal', 'created_at');
    await queryInterface.removeColumn('proposal', 'updated_at');
  }
};
