// models/Staff.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Role = require("./Role");

const Staff = sequelize.define(
  "Staff",
  {
    staff_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: { model: Role, key: "role_id" },
    },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
  },
  { timestamps: false }
);

Staff.belongsTo(Role, { foreignKey: "role_id" });
module.exports = Staff;