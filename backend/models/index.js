// models/index.js
const Customer = require('./Customer');
const Visitor = require('./Visitor');
const CustomerLand = require('./CustomerLand');
const VisitorLand = require('./VisitorLand');
const Role = require('./Role');
const Staff = require('./Staff');
const Message = require('./Message');
const Proposal = require('./Proposal');
const Payment = require('./Payment');
const Inventory = require('./Inventory');
const Notification = require('./Notification');
const Request = require('./Request');
const Project = require('./Project');
const Progress = require('./progress');
const ProjectProgress = require('./ProjectProgress');
const PlantShipment = require('./PlantShipment');
const CustomerDocument = require('./CustomerDocument');

// Initialize associations
const models = {
  Customer,
  Visitor,
  CustomerLand,
  VisitorLand,
  Role,
  Staff,
  Message,
  Proposal,
  Payment,
  Inventory,
  Notification,
  Request,
  Project,
  Progress,
  ProjectProgress,
  PlantShipment,
  CustomerDocument
};

// Set up relationships between models
// Proposal - Project relationship
Proposal.hasOne(Project, { foreignKey: 'proposal_id' });
Project.belongsTo(Proposal, { foreignKey: 'proposal_id' });

// Project - ProjectProgress relationship
Project.hasMany(ProjectProgress, { foreignKey: 'project_id' });
ProjectProgress.belongsTo(Project, { foreignKey: 'project_id' });

// Staff - ProjectProgress relationship
Staff.hasMany(ProjectProgress, { foreignKey: 'staff_id' });
ProjectProgress.belongsTo(Staff, { foreignKey: 'staff_id' });

// Customer - Proposal relationship
Customer.hasMany(Proposal, { foreignKey: 'customer_id' });
Proposal.belongsTo(Customer, { foreignKey: 'customer_id' });

// CustomerLand - Proposal relationship
CustomerLand.hasMany(Proposal, { foreignKey: 'customer_land_id' });
Proposal.belongsTo(CustomerLand, { foreignKey: 'customer_land_id' });

// Project - Progress relationship (legacy)
Project.hasMany(Progress, { foreignKey: 'project_id' });

// Call associate method if it exists (for any models that have it)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
