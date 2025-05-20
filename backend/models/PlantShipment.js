// models/PlantShipment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Staff = require("./Staff");
const Customer = require("./Customer");
const Inventory = require("./Inventory");

const PlantShipment = sequelize.define(
  "plant_shipment",
  {
    shipment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: { model: Staff, key: "staff_id" },
      allowNull: false
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: { model: Customer, key: "customer_id" },
      allowNull: false
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      references: { model: Inventory, key: "inventory_id" },
      allowNull: false
    },
    plant_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT
    }
  },
  {
    timestamps: false,
    tableName: 'plant_shipment'
  }
);

// Define associations
PlantShipment.belongsTo(Staff, { foreignKey: "staff_id" });
PlantShipment.belongsTo(Customer, { foreignKey: "customer_id" });
PlantShipment.belongsTo(Inventory, { foreignKey: "inventory_id" });

module.exports = PlantShipment;
