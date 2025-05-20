// routes/dashboardRoutes.js
/**
 * Dashboard Routes
 * Handles all dashboard-related endpoints
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Routes accessible by both Admin and Staff
router.get('/stats', authorize(['Admin', 'Staff']), dashboardController.getStats);
router.get('/activity', authorize(['Admin', 'Staff']), dashboardController.getActivity);

module.exports = router;
