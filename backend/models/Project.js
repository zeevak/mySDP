// models/Project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Staff = require("./Staff");

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
    project_type: {
      type: DataTypes.STRING(8),
      defaultValue: "Agarwood",
      validate: { isIn: [["Agarwood", "Other"]] },
    },
    area_marked: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(50), defaultValue: "Pending" },
    start_date: { type: DataTypes.DATE },
    end_date: { type: DataTypes.DATE },
  },
  { timestamps: false }
);

Project.belongsTo(Staff, { foreignKey: "staff_id" });
module.exports = Project;