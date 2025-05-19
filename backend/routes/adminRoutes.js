// routes/adminRoutes.js
/**
 * Admin Routes
 * Handles all admin-specific endpoints
 */

const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const dashboardController = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/auth");

// Staff management routes - Admin only
router.get('/staff', protect, authorize(['Admin']), staffController.getAllStaff);
router.post('/staff', protect, authorize(['Admin']), staffController.createStaff);
router.put('/staff/:id', protect, authorize(['Admin']), staffController.updateStaff);
router.delete('/staff/:id', protect, authorize(['Admin']), staffController.deleteStaff);

// Role management - Admin only
router.post("/staff/add-role", protect, authorize(['Admin']), staffController.createRole);
router.post("/staff/create-admin", protect, authorize(['Admin']), staffController.createAdmin);

// Dashboard routes
router.get('/dashboard/stats', protect, authorize(['Admin']), dashboardController.getStats);
router.get('/dashboard/activity', protect, authorize(['Admin']), dashboardController.getActivity);

module.exports = router;
