const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update project table with new fields
    await queryInterface.addColumn('projects', 'progress_percentage', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    });

    await queryInterface.addColumn('projects', 'weather_conditions', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('projects', 'soil_conditions', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('projects', 'irrigation_status', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('projects', 'pest_disease_status', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('projects', 'notes', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('projects', 'last_updated', {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    });

    await queryInterface.addColumn('projects', 'created_at', {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    });

    await queryInterface.addColumn('projects', 'updated_at', {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    });

    // Update status field to allow new values
    await queryInterface.changeColumn('projects', 'status', {
      type: DataTypes.STRING(20),
      defaultValue: "Yet To Start",
      validate: { isIn: [["Yet To Start", "Ongoing", "Completed"]] }
    });

    // Create project_progress table
    await queryInterface.createTable('project_progresses', {
      progress_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'projects',
          key: 'project_id'
        },
        allowNull: false
      },
      staff_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'staff',
          key: 'staff_id'
        },
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      work_completed: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      next_steps: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      weather_conditions: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      soil_conditions: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      irrigation_status: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      pest_disease_status: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      challenges_faced: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      materials_used: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      labor_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      progress_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100
        }
      },
      photos: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns from projects table
    await queryInterface.removeColumn('projects', 'progress_percentage');
    await queryInterface.removeColumn('projects', 'weather_conditions');
    await queryInterface.removeColumn('projects', 'soil_conditions');
    await queryInterface.removeColumn('projects', 'irrigation_status');
    await queryInterface.removeColumn('projects', 'pest_disease_status');
    await queryInterface.removeColumn('projects', 'notes');
    await queryInterface.removeColumn('projects', 'last_updated');
    await queryInterface.removeColumn('projects', 'created_at');
    await queryInterface.removeColumn('projects', 'updated_at');

    // Drop project_progress table
    await queryInterface.dropTable('project_progresses');

    // Revert status field
    await queryInterface.changeColumn('projects', 'status', {
      type: DataTypes.STRING(10),
      defaultValue: "Pending",
      validate: { isIn: [["Pending", "Ongoing", "Completed"]] }
    });
  }
};
