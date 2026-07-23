const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Customer = require("./Customer");
const CustomerLand = require("./CustomerLand");

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
    customer_land_id: {
      type: DataTypes.STRING(10),
      allowNull: true, // Make it optional to support existing proposals
      references: { model: CustomerLand, key: "customer_land_id" },
    },
    project_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'Pending',
      validate: { isIn: [['Pending', 'Under Review', 'Approved', 'Rejected']] }
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'proposal'
  }
);

// Set up associations
Proposal.belongsTo(Customer, { 
  foreignKey: "customer_id", 
  targetKey: "customer_id",
  as: "Customer"
});

Proposal.belongsTo(CustomerLand, {
  foreignKey: "customer_land_id",
  targetKey: "customer_land_id",
  as: "CustomerLand"
});

module.exports = Proposal;
