const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const CustomerDocument = sequelize.define(
  "customer_document",
  {
    document_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: Customer, key: "customer_id" },
    },
    caption: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING(50),
    },
    file_size: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'customer_document'
  }
);

CustomerDocument.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "CASCADE" });
Customer.hasMany(CustomerDocument, { foreignKey: "customer_id", onDelete: "CASCADE" });

module.exports = CustomerDocument;
