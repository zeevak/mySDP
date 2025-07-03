// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const projectController = require("../controllers/projectController");

// Get all approved projects
router.get("/approved", protect, projectController.getApprovedProjects);

// Get project details with progress history
router.get("/:projectId", protect, projectController.getProjectDetails);

// Update project status
router.put("/:projectId/status", protect, projectController.updateProjectStatus);

// Add project progress entry
router.post("/:projectId/progress", protect, projectController.addProjectProgress);

// Get project progress history (renamed from "progress history" to "Progress")
router.get("/:projectId/progress", protect, projectController.getProjectProgress);

// Get single progress entry for editing
router.get("/:projectId/progress/:progressId", protect, projectController.getProgressEntry);

// Update project progress entry
router.put("/:projectId/progress/:progressId", protect, projectController.updateProjectProgress);

// Delete project progress entry
router.delete("/:projectId/progress/:progressId", protect, projectController.deleteProjectProgress);

module.exports = router;
