const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const Proposal = sequelize.define(
  "proposal",
  {
    proposal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Customer, key: "customer_id" },
    },
    payment_mode: {
      type: DataTypes.STRING(12),
      validate: { isIn: [['full', 'installment']] }
    },
    installment_count: { type: DataTypes.INTEGER },
    installment_amount: { type: DataTypes.DECIMAL(10, 2) },
    beneficiaries: { type: DataTypes.TEXT },
    contract_signed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    proposal_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    tableName: 'proposal'
  }
);

Proposal.belongsTo(Customer, { foreignKey: "customer_id", onDelete: "CASCADE" });

module.exports = Proposal;
