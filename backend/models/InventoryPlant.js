// models/InventoryPlant.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InventoryPlant = sequelize.define(
  "inventory_plant",
  {
    plant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plant_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    scientific_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'inventory_plant'
  }
);

module.exports = InventoryPlant;
