// routes/adminRoutes.js
/**
 * Admin Routes
 * Handles all admin-specific endpoints
 */

const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/auth");

// Staff management routes - Admin only
router.get('/staff', protect, authorize(['Admin']), staffController.getAllStaff);
router.post('/staff', protect, authorize(['Admin']), staffController.createStaff);
router.put('/staff/:id', protect, authorize(['Admin']), staffController.updateStaff);
router.delete('/staff/:id', protect, authorize(['Admin']), staffController.deleteStaff);

// Role management - Admin only
router.post("/staff/add-role", protect, authorize(['Admin']), staffController.createRole);
router.post("/staff/create-admin", protect, authorize(['Admin']), staffController.createAdmin);

// Add placeholder routes for dashboard data that the frontend is requesting
router.get('/dashboard/stats', protect, authorize(['Admin']), (req, res) => {
  // Placeholder response - this should be replaced with actual data
  res.json({
    customers: 0,
    staff: 0,
    projects: 0,
    inventory: 0,
    messages: 0,
    requests: 0
  });
});

router.get('/dashboard/activity', protect, authorize(['Admin']), (req, res) => {
  // Placeholder response - this should be replaced with actual data
  res.json([]);
});

module.exports = router;
