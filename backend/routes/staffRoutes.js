// 
// routes/staffRoutes.js
/**
 * Staff Routes
 * Handles all staff-related authentication and profile endpoints
 */

const express = require("express");
const router = express.Router();
const staffAuthController = require("../controllers/staffAuthController");
const staffController = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/auth");

// Add logging to verify imports
console.log('Available staff controller methods:', Object.keys(staffController));

// Staff authentication routes (for both admin and regular staff)
router.post("/login", staffAuthController.login);
router.get("/me", protect, authorize(['Admin', 'Staff']), staffAuthController.getCurrentStaff);

// Staff management routes - Admin only
router.get('/all', protect, authorize(['Admin']), staffController.getAllStaff);
router.post('/create', protect, authorize(['Admin']), staffController.createStaff);
router.put('/:id', protect, authorize(['Admin']), staffController.updateStaff);
router.delete('/:id', protect, authorize(['Admin']), staffController.deleteStaff);

// Role management - Admin only
router.post("/add-role", protect, authorize(['Admin']), staffController.createRole);
router.post("/create-admin", protect, authorize(['Admin']), staffController.createAdmin);
// In your routes file (e.g., staffRoutes.js)
router.post('/create-initial-admin', staffAuthController.createInitialAdmin);

module.exports = router;
