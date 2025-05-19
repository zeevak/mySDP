// models/progress.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Project = require("./project");

const Progress = sequelize.define(
  "progress",
  {
    progress_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Project, key: "project_id" },
    },
    phase: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
      }
    },
    topic: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    tableName: 'progress',
    timestamps: false
  }
);

// Define the association
Progress.belongsTo(Project, { 
  foreignKey: "project_id", 
  onDelete: "CASCADE" 
});

module.exports = Progress;
