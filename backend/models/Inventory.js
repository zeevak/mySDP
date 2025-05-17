const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Staff = require("./Staff");

const Inventory = sequelize.define(
  "inventory",
  {
    inventory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: { model: Staff, key: "staff_id" },
    },
    item_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    item_type: {
      type: DataTypes.STRING(15),
      validate: { isIn: [['Plant', 'Fertilizer']] }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: 'inventory'
  }
);

Inventory.belongsTo(Staff, { foreignKey: "staff_id", onDelete: "SET NULL" });

module.exports = Inventory;
