// models/CustomerLand.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const CustomerLand = sequelize.define(
  "customer_land",
  {
    customer_land_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Customer, key: "customer_id" },
    },
    province: { type: DataTypes.STRING(50) },
    district: { type: DataTypes.STRING(50) },
    city: { type: DataTypes.STRING(50) },
    climate_zone: { type: DataTypes.STRING(50) },
    land_shape: { type: DataTypes.STRING(50) },
    has_water: { type: DataTypes.BOOLEAN },
    soil_type: { type: DataTypes.STRING(50) },
    has_stones: { type: DataTypes.BOOLEAN },
    has_landslide_risk: { type: DataTypes.BOOLEAN },
    has_forestry: { type: DataTypes.BOOLEAN },
    land_size: { type: DataTypes.DECIMAL(10, 2) },
  },
  { 
    timestamps: false,
    tableName: 'customer_land'
  }
);

CustomerLand.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "CASCADE" });

module.exports = CustomerLand;
