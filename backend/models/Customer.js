// models/Customer.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define(
  "customer",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING(5) },
    name_with_ini: { type: DataTypes.STRING(100), allowNull: false },
    full_name: { type: DataTypes.STRING(255), allowNull: false },
    f_name: { type: DataTypes.STRING(50), allowNull: false },
    l_name: { type: DataTypes.STRING(50), allowNull: false },
    date_of_birth: { type: DataTypes.DATE },
    nic_number: { type: DataTypes.STRING(12) },
    add_line_1: { type: DataTypes.TEXT },
    add_line_2: { type: DataTypes.TEXT },
    add_line_3: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING(50) },
    district: { type: DataTypes.STRING(50) },
    province: { type: DataTypes.STRING(50) },
    phone_no_1: { type: DataTypes.STRING(12) },
    phone_no_2: { type: DataTypes.STRING(12) },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    health_info: { type: DataTypes.TEXT },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
  },
  {
    timestamps: false,
    tableName: 'customer'
  }
);

// This will be initialized after CustomerLand is defined to avoid circular dependencies
Customer.associate = (models) => {
  Customer.hasMany(models.CustomerLand, {
    foreignKey: 'customer_id',
    as: 'lands'
  });
};

module.exports = Customer;