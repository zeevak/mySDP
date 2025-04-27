// models/Customer.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING(50) },
    full_name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT },
    province: { type: DataTypes.STRING(50) },
    district: { type: DataTypes.STRING(50) },
    city: { type: DataTypes.STRING(50) },
    nic_number: { type: DataTypes.STRING(12) },
    date_of_birth: { type: DataTypes.DATE },
    phone_number: { type: DataTypes.STRING(15) },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    health_info: { type: DataTypes.TEXT },
    password_hash: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: false }
);

module.exports = Customer;