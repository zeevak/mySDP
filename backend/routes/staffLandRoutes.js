const express = require('express');
const router = express.Router();
const landManagementController = require('../controllers/landManagementController');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);
router.use(authorize(['Staff', 'Admin']));

// Land management routes
router.get('/', landManagementController.getAllLands);
router.get('/:id', landManagementController.getLandById);
router.put('/:id', landManagementController.updateLand);
router.delete('/:id', landManagementController.deleteLand);

module.exports = router;
