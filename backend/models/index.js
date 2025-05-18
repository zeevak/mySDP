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
  Progress
};

// Set up relationships between models
// Proposal - Project relationship
Proposal.hasOne(Project, { foreignKey: 'proposal_id' });

// Project - Progress relationship
Project.hasMany(Progress, { foreignKey: 'project_id' });

// Call associate method if it exists (for any models that have it)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
