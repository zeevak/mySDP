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

// Admin creation routes
router.post('/create-initial-admin', staffAuthController.createInitialAdmin);

// Test routes for debugging
router.post('/create-test-staff', staffAuthController.createTestStaff);

module.exports = router;
