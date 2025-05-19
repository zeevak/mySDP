// routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getProgressByProject, 
  addProgress, 
  updateProgress, 
  deleteProgress 
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Get all progress entries for a project
router.get('/:projectId', authorize(['Admin', 'Staff']), getProgressByProject);

// Add a new progress entry
router.post('/', authorize(['Admin', 'Staff']), addProgress);

// Update a progress entry
router.put('/:id', authorize(['Admin', 'Staff']), updateProgress);

// Delete a progress entry
router.delete('/:id', authorize(['Admin']), deleteProgress);

module.exports = router;
