const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Visitor = require("./Visitor");

const Land = sequelize.define(
  "Land",
  {
    eligibility_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    visitor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Visitor, key: "visitor_id" },
    },
    eligible: { type: DataTypes.BOOLEAN },
    suggested_crops: { type: DataTypes.TEXT },
    feedback: { type: DataTypes.TEXT },
    checked_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

Land.belongsTo(Visitor, { foreignKey: "visitor_id", onDelete: "CASCADE" });

module.exports = Land;