// controllers/progressController.js
const Progress = require('../models/progress');
const Project = require('../models/Project');

/**
 * Get all progress entries for a specific project
 * @route GET /api/progress/:projectId
 * @access Private
 */
exports.getProgressByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found"
      });
    }
    
    // Get all progress entries for this project
    const progressEntries = await Progress.findAll({
      where: { project_id: projectId },
      order: [['date', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: progressEntries.length,
      data: progressEntries
    });
  } catch (err) {
    console.error("Error fetching project progress:", err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

/**
 * Add a new progress entry for a project
 * @route POST /api/progress
 * @access Private
 */
exports.addProgress = async (req, res) => {
  try {
    const { project_id, phase, date, topic, description } = req.body;
    
    // Verify project exists
    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found"
      });
    }
    
    // Create new progress entry
    const newProgress = await Progress.create({
      project_id,
      phase,
      date,
      topic,
      description
    });
    
    res.status(201).json({
      success: true,
      data: newProgress
    });
  } catch (err) {
    console.error("Error adding progress:", err);
    
    // Handle validation errors
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => e.message);
      return res.status(400).json({
        success: false,
        error: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

/**
 * Update a progress entry
 * @route PUT /api/progress/:id
 * @access Private
 */
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { phase, date, topic, description } = req.body;
    
    // Find the progress entry
    const progress = await Progress.findByPk(id);
    if (!progress) {
      return res.status(404).json({
        success: false,
        error: "Progress entry not found"
      });
    }
    
    // Update the progress entry
    await progress.update({
      phase,
      date,
      topic,
      description
    });
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    console.error("Error updating progress:", err);
    
    // Handle validation errors
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => e.message);
      return res.status(400).json({
        success: false,
        error: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

/**
 * Delete a progress entry
 * @route DELETE /api/progress/:id
 * @access Private
 */
exports.deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the progress entry
    const progress = await Progress.findByPk(id);
    if (!progress) {
      return res.status(404).json({
        success: false,
        error: "Progress entry not found"
      });
    }
    
    // Delete the progress entry
    await progress.destroy();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error("Error deleting progress:", err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};
