const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Proposal = require("./Proposal");

const Payment = sequelize.define(
  "payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    proposal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Proposal, key: "proposal_id" },
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    payment_receipt_url: { type: DataTypes.STRING(255) }
  },
  {
    timestamps: false,
    tableName: 'payment'
  }
);

Payment.belongsTo(Proposal, { foreignKey: "proposal_id", onDelete: "CASCADE" });

module.exports = Payment;
