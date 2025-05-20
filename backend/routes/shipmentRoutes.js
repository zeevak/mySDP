// routes/shipmentRoutes.js
/**
 * Shipment Routes
 * Handles all plant shipment-related endpoints
 */

const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Routes accessible by both Admin and Staff
router.get('/', authorize(['Admin', 'Staff']), shipmentController.getAllShipments);
router.get('/customer/:customerId', authorize(['Admin', 'Staff']), shipmentController.getShipmentsByCustomer);
router.post('/', authorize(['Admin', 'Staff']), shipmentController.createShipment);

// Routes accessible by Admin only
router.delete('/:id', authorize(['Admin']), shipmentController.deleteShipment);

module.exports = router;
