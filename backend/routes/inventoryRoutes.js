// routes/inventoryRoutes.js
/**
 * Inventory Routes
 * Handles all inventory-related endpoints
 */

const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

// Routes accessible by both Admin and Staff
router.get('/', protect, authorize(['Admin', 'Staff']), inventoryController.getAllInventory);
router.get('/:id', protect, authorize(['Admin', 'Staff']), inventoryController.getInventoryById);
router.post('/reduce', protect, authorize(['Admin', 'Staff']), inventoryController.reduceInventory);

// Routes accessible by Admin only
router.post('/', protect, authorize(['Admin']), inventoryController.createInventory);
router.put('/:id', protect, authorize(['Admin']), inventoryController.updateInventory);
router.delete('/:id', protect, authorize(['Admin']), inventoryController.deleteInventory);

module.exports = router;
