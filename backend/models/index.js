// models/index.js
const Customer = require('./Customer');
const Visitor = require('./Visitor');
const CustomerLand = require('./CustomerLand');
const VisitorLand = require('./VisitorLand');
const Role = require('./Role');
const Staff = require('./Staff');

// Initialize associations
const models = {
  Customer,
  Visitor,
  CustomerLand,
  VisitorLand,
  Role,
  Staff
};

// Call associate method if it exists
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
