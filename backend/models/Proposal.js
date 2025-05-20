const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");

const Proposal = sequelize.define(
  "proposal",
  {
    proposal_id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: sequelize.literal("concat('PRO', nextval('proposal_id_seq'::regclass))"),
    },
    customer_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: { model: Customer, key: "customer_id" },
    },
    project_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: { isIn: [["Agarwood", "Sandalwood", "Vanilla", "Other"]] },
    },
    project_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in years"
    },
    project_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_mode: {
      type: DataTypes.STRING(12),
      validate: { isIn: [['full', 'installments']] }
    },
    installment_count: { type: DataTypes.INTEGER },
    installment_amount: { type: DataTypes.DECIMAL(10, 2) },
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
