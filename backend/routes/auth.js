// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Public routes
router.post("/register", authController.register);
router.post("/customer-login", authController.customerLogin);
router.post("/admin-login", authController.adminLogin);

// Protected routes
router.get("/me", auth, authController.getCurrentUser);
router.post("/add-role", auth, authController.createRole);
router.post("/create-admin", auth, authController.createAdmin);

module.exports = router;