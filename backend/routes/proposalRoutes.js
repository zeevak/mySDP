// routes/proposalRoutes.js
const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require staff or admin role
router.use(protect);
router.use(authorize(['Staff', 'Admin']));

// Get all customers for proposal creation
router.get('/customers', proposalController.getCustomersForProposal);

// Get project durations based on project type
router.get('/durations/:projectType', proposalController.getProjectDurations);

// Calculate installment details
router.post('/calculate-installments', proposalController.calculateInstallments);

// Create a new proposal
router.post('/', proposalController.createProposal);

module.exports = router;
