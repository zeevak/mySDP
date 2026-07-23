// routes/proposalRoutes.js
const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require staff or admin role
router.use(protect);
router.use(authorize(['Staff', 'Admin']));

// Get all proposals
router.get('/', proposalController.getAllProposals);

// Get all customers for proposal creation (must be before /:id route)
router.get('/customers', proposalController.getCustomersForProposal);

// Get customer lands for a specific customer (must be before /:id route)
router.get('/customer-lands/:customerId', proposalController.getCustomerLands);

// Get project durations based on project type (must be before /:id route)
router.get('/durations/:projectType', proposalController.getProjectDurations);

// Calculate installment details
router.post('/calculate-installments', proposalController.calculateInstallments);

// Create a new proposal
router.post('/', proposalController.createProposal);

// Get single proposal
router.get('/:id', proposalController.getProposal);

// Update proposal
router.patch('/:id', proposalController.updateProposal);

// Update proposal status
router.patch('/:id/status', proposalController.updateProposalStatus);

// Update proposal land selection
router.patch('/:id/land', proposalController.updateProposalLand);

// Delete proposal
router.delete('/:id', authorize(['Admin']), proposalController.deleteProposal);

module.exports = router;
