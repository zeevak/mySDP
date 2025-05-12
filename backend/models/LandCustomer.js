// models/LandCustomer.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const LandCustomer = sequelize.define(
  "land_customer",
  {
    land_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Customer, key: "customer_id" },
    },
    land_size: { type: DataTypes.DECIMAL(10, 2) },
    land_location: { type: DataTypes.STRING },
    soil_type: { type: DataTypes.STRING(50) },
    geo_type: { type: DataTypes.STRING(50) },
    climate: { type: DataTypes.STRING(50) },
    status: { 
      type: DataTypes.STRING(20),
      defaultValue: 'Active'
    },
    acquisition_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { 
    timestamps: false,
    tableName: 'land_customer'
  }
);

LandCustomer.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "CASCADE" });

module.exports = LandCustomer;
