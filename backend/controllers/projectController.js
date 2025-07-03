// controllers/projectController.js
const Project = require("../models/Project");
const ProjectProgress = require("../models/ProjectProgress");
const Proposal = require("../models/Proposal");
const Customer = require("../models/Customer");
const CustomerLand = require("../models/CustomerLand");
const { Op } = require("sequelize");

// Helper function to calculate progress percentage based on dates
const calculateProgressPercentage = (startDate, endDate, status) => {
  if (status === 'Yet To Start') {
    return 0;
  }
  
  if (status === 'Completed') {
    return 100;
  }
  
  if (status === 'Ongoing' && startDate) {
    const start = new Date(startDate);
    const now = new Date();
    
    // If there's an end date, use it, otherwise estimate based on project duration
    if (endDate) {
      const end = new Date(endDate);
      const totalDuration = end.getTime() - start.getTime();
      const elapsedDuration = now.getTime() - start.getTime();
      
      if (elapsedDuration <= 0) return 0;
      if (elapsedDuration >= totalDuration) return 100;
      
      return Math.min(100, Math.max(0, Math.round((elapsedDuration / totalDuration) * 100)));
    } else {
      // For projects without end date, estimate based on elapsed time
      // Assume a typical agricultural project duration of 120 days (4 months)
      const estimatedDurationMs = 120 * 24 * 60 * 60 * 1000; // 120 days in milliseconds
      const elapsedDuration = now.getTime() - start.getTime();
      
      if (elapsedDuration <= 0) return 0;
      
      const percentage = Math.round((elapsedDuration / estimatedDurationMs) * 100);
      return Math.min(95, Math.max(0, percentage)); // Cap at 95% until completion
    }
  }
  
  return 0;
};

// Get all approved projects for staff
exports.getApprovedProjects = async (req, res) => {
  try {
    // First, create projects for any approved proposals that don't have projects yet
    const approvedProposals = await Proposal.findAll({
      where: { status: 'Approved' },
      include: [
        {
          model: Customer,
          attributes: ['customer_id', 'full_name', 'email', 'phone_no_1']
        },
        {
          model: CustomerLand,
          attributes: ['customer_land_id', 'city', 'land_size']
        }
      ]
    });

    // Create projects for approved proposals that don't have projects yet
    for (const proposal of approvedProposals) {
      const existingProject = await Project.findOne({
        where: { proposal_id: proposal.proposal_id }
      });

      if (!existingProject) {
        await Project.create({
          proposal_id: proposal.proposal_id,
          status: 'Yet To Start',
          progress_percentage: 0,
          last_updated: new Date()
        });
      }
    }

    // Now get all projects with their proposal details
    const projects = await Project.findAll({
      include: [
        {
          model: Proposal,
          attributes: ['proposal_id', 'customer_id', 'customer_land_id', 'project_type', 'project_duration'],
          where: { status: 'Approved' },
          include: [
            {
              model: Customer,
              attributes: ['customer_id', 'full_name', 'email', 'phone_no_1']
            },
            {
              model: CustomerLand,
              attributes: ['customer_land_id', 'city', 'land_size']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Calculate and update progress percentage for each project
    for (const project of projects) {
      const calculatedProgress = calculateProgressPercentage(
        project.start_date,
        project.end_date,
        project.status
      );
      
      if (project.progress_percentage !== calculatedProgress) {
        await project.update({
          progress_percentage: calculatedProgress,
          last_updated: new Date()
        });
      }
    }

    res.json({
      success: true,
      data: projects,
      message: 'Approved projects retrieved successfully'
    });
  } catch (err) {
    console.error('Error fetching approved projects:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching projects" 
    });
  }
};

// Get project details with progress history
exports.getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Proposal,
          attributes: ['proposal_id', 'customer_id', 'customer_land_id', 'project_type'],
          include: [
            {
              model: Customer,
              attributes: ['customer_id', 'full_name', 'email', 'phone_no_1']
            },
            {
              model: CustomerLand,
              attributes: ['customer_land_id', 'city', 'land_size']
            }
          ]
        },
        {
          model: ProjectProgress,
          order: [['date', 'DESC']]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Calculate and update progress percentage
    const calculatedProgress = calculateProgressPercentage(
      project.start_date,
      project.end_date,
      project.status
    );
    
    if (project.progress_percentage !== calculatedProgress) {
      await project.update({
        progress_percentage: calculatedProgress,
        last_updated: new Date()
      });
    }

    res.json({
      success: true,
      data: project,
      message: 'Project details retrieved successfully'
    });
  } catch (err) {
    console.error('Error fetching project details:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching project details" 
    });
  }
};

// Update project status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, start_date, end_date } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updateData = { status, last_updated: new Date() };
    
    if (status === 'Ongoing' && start_date) {
      updateData.start_date = start_date;
    }
    
    if (status === 'Completed' && end_date) {
      updateData.end_date = end_date;
    }

    // Calculate progress percentage based on the new status and dates
    const calculatedProgress = calculateProgressPercentage(
      updateData.start_date || project.start_date,
      updateData.end_date || project.end_date,
      status
    );
    
    updateData.progress_percentage = calculatedProgress;

    await project.update(updateData);

    res.json({
      success: true,
      data: project,
      message: 'Project status updated successfully'
    });
  } catch (err) {
    console.error('Error updating project status:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating project status" 
    });
  }
};

// Add project progress entry
exports.addProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Get current project to calculate progress percentage
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Calculate current progress percentage
    const calculatedProgress = calculateProgressPercentage(
      project.start_date,
      project.end_date,
      project.status
    );

    const progressData = {
      project_id: projectId,
      staff_id: req.user.id,
      progress_percentage: calculatedProgress, // Auto-calculated, not from user input
      ...req.body
    };

    // Remove progress_percentage from req.body if it exists (ignore user input)
    delete progressData.progress_percentage;
    progressData.progress_percentage = calculatedProgress;

    const progress = await ProjectProgress.create(progressData);

    // Update project's progress percentage and last updated
    await Project.update(
      { 
        progress_percentage: calculatedProgress,
        last_updated: new Date()
      },
      { where: { project_id: projectId } }
    );

    res.json({
      success: true,
      data: progress,
      message: 'Project progress added successfully'
    });
  } catch (err) {
    console.error('Error adding project progress:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while adding project progress" 
    });
  }
};

// Get project progress history
exports.getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const progressEntries = await ProjectProgress.findAll({
      where: { project_id: projectId },
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      data: progressEntries,
      message: 'Project progress retrieved successfully'
    });
  } catch (err) {
    console.error('Error fetching project progress:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching project progress" 
    });
  }
};

// Update project progress entry
exports.updateProjectProgress = async (req, res) => {
  try {
    const { projectId, progressId } = req.params;
    
    // Find the progress entry
    const progress = await ProjectProgress.findOne({
      where: { 
        progress_id: progressId,
        project_id: projectId 
      }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }

    // Get current project to recalculate progress percentage
    const project = await Project.findByPk(projectId);
    const calculatedProgress = calculateProgressPercentage(
      project.start_date,
      project.end_date,
      project.status
    );

    // Update the progress entry with new data
    const updateData = {
      ...req.body,
      progress_percentage: calculatedProgress // Always use calculated progress
    };

    await progress.update(updateData);

    // Update project's last updated timestamp
    await Project.update(
      { last_updated: new Date() },
      { where: { project_id: projectId } }
    );

    res.json({
      success: true,
      data: progress,
      message: 'Project progress updated successfully'
    });
  } catch (err) {
    console.error('Error updating project progress:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating project progress" 
    });
  }
};

// Delete project progress entry
exports.deleteProjectProgress = async (req, res) => {
  try {
    const { projectId, progressId } = req.params;

    // Find the progress entry
    const progress = await ProjectProgress.findOne({
      where: { 
        progress_id: progressId,
        project_id: projectId 
      }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }

    await progress.destroy();

    // Update project's last updated timestamp
    await Project.update(
      { last_updated: new Date() },
      { where: { project_id: projectId } }
    );

    res.json({
      success: true,
      message: 'Project progress deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting project progress:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting project progress" 
    });
  }
};

// Get single progress entry for editing
exports.getProgressEntry = async (req, res) => {
  try {
    const { projectId, progressId } = req.params;

    const progress = await ProjectProgress.findOne({
      where: { 
        progress_id: progressId,
        project_id: projectId 
      }
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }

    res.json({
      success: true,
      data: progress,
      message: 'Progress entry retrieved successfully'
    });
  } catch (err) {
    console.error('Error fetching progress entry:', err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching progress entry" 
    });
  }
};