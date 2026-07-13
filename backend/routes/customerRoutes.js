// routes/customerRoutes.js
/**
 * Customer Routes
 * Handles all customer-related authentication and profile endpoints
 */

const express = require("express");
const router = express.Router();
const customerAuthController = require("../controllers/customerAuthController");
const { protect, authorize } = require("../middleware/auth");

// Public customer routes
router.post("/register", customerAuthController.register);
router.post("/login", customerAuthController.login);

// Protected customer routes
router.get("/me", protect, authorize('customer'), customerAuthController.getCurrentCustomer);

module.exports = router;
