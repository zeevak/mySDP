// routes/inventoryPlantRoutes.js
/**
 * Inventory Plant Routes
 * Handles all plant-related endpoints for inventory
 */

const express = require('express');
const router = express.Router();
const inventoryPlantController = require('../controllers/inventoryPlantController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Routes accessible by both Admin and Staff
router.get('/', authorize(['Admin', 'Staff']), inventoryPlantController.getAllPlants);
router.get('/:id', authorize(['Admin', 'Staff']), inventoryPlantController.getPlantById);

// Routes accessible by Admin only
router.post('/', authorize(['Admin']), inventoryPlantController.createPlant);
router.put('/:id', authorize(['Admin']), inventoryPlantController.updatePlant);
router.delete('/:id', authorize(['Admin']), inventoryPlantController.deletePlant);

module.exports = router;
