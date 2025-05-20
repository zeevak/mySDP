// models/Project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Staff = require("./Staff");
const Proposal = require("./proposal");

const Project = sequelize.define(
  "project",
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: { model: Staff, key: "staff_id" },
    },
    proposal_id: {
      type: DataTypes.STRING(10),
      references: { model: Proposal, key: "proposal_id" },
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Pending",
      validate: { isIn: [["Pending", "Ongoing", "Completed"]] }
    },
    start_date: {
      type: DataTypes.DATE,
      validate: {
        isValidStartDate(value) {
          if (value && this.status === 'Pending') {
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
  },
  { timestamps: false }
);

// Define associations without foreign key constraints
// We'll handle the relationships in the application logic
// Note: We don't define the hasMany relationship here to avoid circular dependencies
// This will be defined in the index.js file

module.exports = Project;
