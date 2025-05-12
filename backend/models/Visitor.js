// models/Visitor.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Visitor = sequelize.define(
  "visitor",
  {
    visitor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING(5) },
    f_name: { type: DataTypes.STRING(50), allowNull: false },
    l_name: { type: DataTypes.STRING(50), allowNull: false },
    phone: { type: DataTypes.STRING(12) },
    email: { type: DataTypes.STRING(50), unique: true },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'visitor'
  }
);

module.exports = Visitor;