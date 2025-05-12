// models/VisitorLand.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Visitor = require("./Visitor");

const VisitorLand = sequelize.define(
  "visitor_land",
  {
    visitor_land_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    visitor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Visitor, key: "visitor_id" },
    },
    province: { type: DataTypes.STRING(50) },
    district: { type: DataTypes.STRING(50) },
    city: { type: DataTypes.STRING(50) },
    climate_zone: { type: DataTypes.STRING(50) },
    land_shape: { type: DataTypes.STRING(50) },
    has_water: { type: DataTypes.BOOLEAN },
    soil_type: { type: DataTypes.STRING(50) },
    has_stones: { type: DataTypes.BOOLEAN },
    has_landslide_risk: { type: DataTypes.BOOLEAN },
    has_forestry: { type: DataTypes.BOOLEAN },
    land_size: { type: DataTypes.DECIMAL(10, 2) },
  },
  { 
    timestamps: false,
    tableName: 'visitor_land'
  }
);

VisitorLand.belongsTo(Visitor, { foreignKey: "visitor_id", onDelete: "CASCADE" });

module.exports = VisitorLand;
