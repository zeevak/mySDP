// routes/staffCustomerRoutes.js
/**
 * Staff Customer Management Routes
 * Handles all customer management endpoints for staff
 */

const express = require('express');
const router = express.Router();
const customerManagementController = require('../controllers/customerManagementController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require staff or admin role
router.use(protect);
router.use(authorize(['Staff', 'Admin']));

// Customer management routes
router.get('/', customerManagementController.getAllCustomers);
router.get('/:id', customerManagementController.getCustomerById);
router.put('/:id', customerManagementController.updateCustomer);
router.delete('/:id', authorize(['Admin']), customerManagementController.deleteCustomer);

const customerAuthController = require('../controllers/customerAuthController');

// Customer land management routes
router.get('/:customerId/lands', customerManagementController.getCustomerLands);
router.post('/:customerId/lands', customerManagementController.addCustomerLand);

// Customer document management routes for staff
router.get('/:customerId/documents', customerAuthController.getStaffCustomerDocuments);

module.exports = router;
