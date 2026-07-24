const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Request = sequelize.define(
  "request",
  {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    request_type: {
      type: DataTypes.STRING(50),
      defaultValue: "Inquiry",
    },
    request_details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Pending",
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "request",
  }
);

module.exports = Request;
