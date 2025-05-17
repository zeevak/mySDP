const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");
const Staff = require("./Staff");

const Notification = sequelize.define(
  "notification",
  {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      references: { model: Customer, key: "customer_id" },
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: { model: Staff, key: "staff_id" },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sent_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    tableName: 'notification'
  }
);

Notification.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "CASCADE" });
Notification.belongsTo(Staff, { foreignKey: "staff_id", onDelete: "SET NULL" });

module.exports = Notification;
