// models/Visitor.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Visitor = sequelize.define(
  "Visitor",
  {
    visitor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(15) },
    email: { type: DataTypes.STRING, unique: true },
    land_size: { type: DataTypes.DECIMAL(10, 2) },
    land_location: { type: DataTypes.STRING },
    soil_type: { type: DataTypes.STRING(50) },
    geo_type: { type: DataTypes.STRING(50) },
    climate: { type: DataTypes.STRING(50) },
    eligibility_status: { type: DataTypes.BOOLEAN },
    eligibility_feedback: { type: DataTypes.TEXT },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

module.exports = Visitor;