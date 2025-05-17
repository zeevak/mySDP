const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

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
      references: { model: Customer, key: "customer_id" },
    },
    request_details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    tableName: 'request'
  }
);

Request.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "CASCADE" });

module.exports = Request;
