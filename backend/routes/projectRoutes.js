// routes/projects.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth"); // FIXED: destructure protect
const projectController = require("../controllers/projectController");

router.get("/", protect, projectController.getProjects);

module.exports = router;
