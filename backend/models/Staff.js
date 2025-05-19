// models/Staff.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Role = require('./Role');

// Log model definition for debugging
console.log('Defining Staff model with phone_no field');

const Staff = sequelize.define('staff', {
  staff_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'staff',
  timestamps: false,
  hooks: {
    beforeCreate: (staff, options) => {
      console.log('Creating staff with data:', JSON.stringify(staff, null, 2));
    },
    beforeUpdate: (staff, options) => {
      console.log('Updating staff with data:', JSON.stringify(staff, null, 2));
    }
  }
});

// Define association
Staff.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(Staff, { foreignKey: 'role_id' });

module.exports = Staff;

// // models/Staff.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");
// const Role = require("./Role");

// const Staff = sequelize.define(
//   "Staff",
//   {
//     staff_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     role_id: {
//       type: DataTypes.INTEGER,
//       references: { model: Role, key: "role_id" },
//     },
//     name: { type: DataTypes.STRING, allowNull: false },
//     username: { type: DataTypes.STRING, unique: true },
//     password_hash: { type: DataTypes.STRING, allowNull: false },
//     email: { type: DataTypes.STRING, unique: true },
//   },
//   { timestamps: false }
// );

// Staff.belongsTo(Role, { foreignKey: "role_id" });
// module.exports = Staff;