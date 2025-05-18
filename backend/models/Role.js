// models/Role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('role', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'role',
  timestamps: false
});

module.exports = Role;



// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const Role = sequelize.define(
//   "Role",
//   {
//     role_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     role_name: { type: DataTypes.STRING, allowNull: false },
//   },
//   { timestamps: false }
// );

// module.exports = Role;