// models/Project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Project = sequelize.define(
  "project",
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proposal_id: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Yet To Start",
      validate: { isIn: [["Yet To Start", "Ongoing", "Completed"]] }
    },
    start_date: {
      type: DataTypes.DATE,
      validate: {
        isValidStartDate(value) {
          if (value && this.status === 'Yet To Start') {
            throw new Error('Start date should only be set for Ongoing or Completed projects');
          }
        }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      validate: {
        isValidEndDate(value) {
          if (value && this.status !== 'Completed') {
            throw new Error('End date should only be set for Completed projects');
          }
          if (value && this.start_date && new Date(value) < new Date(this.start_date)) {
            throw new Error('End date cannot be earlier than start date');
          }
        }
      }
    },
    progress_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  { 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

// Define associations without foreign key constraints
// We'll handle the relationships in the application logic
// Note: We don't define the hasMany relationship here to avoid circular dependencies
// This will be defined in the index.js file

module.exports = Project;
