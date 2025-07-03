// models/ProjectProgress.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectProgress = sequelize.define(
  "project_progress",
  {
    progress_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    staff_id: {
      type: DataTypes.STRING,
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
      allowNull: true, // Changed to allow null since it's auto-calculated
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    photos: {
      type: DataTypes.TEXT, // Store photo URLs as JSON string
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  { 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = ProjectProgress;
