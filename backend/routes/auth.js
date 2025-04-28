// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/customer-login", authController.customerLogin);
router.post("/admin-login", authController.adminLogin);
router.post("/add-role",authController.createRole);
router.post("/create-admin",authController.createAdmin);

module.exports = router;