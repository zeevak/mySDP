const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Inventory = sequelize.define(
  "inventory",
  {
    inventory_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: sequelize.literal("concat('INV', nextval('inventory_id_seq'::regclass))"),
    },
    item_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Unknown Plant'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    timestamps: false,
    tableName: 'inventory'
  }
);

module.exports = Inventory;
