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

const upload = require("../utils/uploadMiddleware");

// Protected customer routes
router.get("/me", protect, authorize('customer'), customerAuthController.getCurrentCustomer);
router.get("/investment-summary", protect, authorize('customer'), customerAuthController.getInvestmentSummary);
router.post("/new-investment", protect, authorize('customer'), customerAuthController.submitNewInvestment);
router.put("/change-password", protect, authorize('customer'), customerAuthController.changePassword);

// Document routes for customer
router.get("/documents", protect, authorize('customer'), customerAuthController.getDocuments);
router.post("/documents", protect, authorize('customer'), upload.single("document"), customerAuthController.uploadDocument);
router.delete("/documents/:documentId", protect, authorize('customer'), customerAuthController.deleteDocument);

module.exports = router;
