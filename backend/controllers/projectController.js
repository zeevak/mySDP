// controllers/projectController.js
const Project = require("../models/Project");
const ProjectProgress = require("../models/ProjectProgress");
const Proposal = require("../models/Proposal");
const Customer = require("../models/Customer");
const CustomerLand = require("../models/CustomerLand");
const Payment = require("../models/Payment");
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
          attributes: ['customer_id', 'f_name', 'l_name', 'full_name', 'email', 'phone_no_1']
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
          attributes: ['proposal_id', 'customer_id', 'customer_land_id', 'project_type', 'project_duration', 'project_value', 'payment_mode'],
          where: { status: 'Approved' },
          include: [
            {
              model: Customer,
              attributes: ['customer_id', 'f_name', 'l_name', 'full_name', 'email', 'phone_no_1']
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
          attributes: ['proposal_id', 'customer_id', 'customer_land_id', 'project_type', 'project_duration', 'project_value', 'payment_mode'],
          include: [
            {
              model: Customer,
              attributes: ['customer_id', 'full_name', 'email', 'phone_no_1']
            },
            {
              model: CustomerLand,
              attributes: ['customer_land_id', 'city', 'district', 'province', 'land_size']
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

    // Clean labor_hours if empty string to avoid DB decimal casting error
    if (req.body && req.body.labor_hours === '') {
      req.body.labor_hours = null;
    }

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

    // Clean labor_hours if empty string to avoid DB decimal casting error
    if (req.body && req.body.labor_hours === '') {
      req.body.labor_hours = null;
    }

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

// Get project payment tracking data
exports.getProjectPayments = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Find the project and its proposal
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Proposal,
          as: 'proposal',
          include: [
            { model: Customer, as: 'Customer' },
            { model: CustomerLand, as: 'CustomerLand' }
          ]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const proposal = project.proposal;
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found for this project'
      });
    }

    // Fetch all payments for this proposal
    const payments = await Payment.findAll({
      where: { proposal_id: proposal.proposal_id },
      order: [['payment_date', 'ASC']]
    });

    const project_value = parseFloat(proposal.project_value);
    const payment_mode = proposal.payment_mode; // 'full' or 'installments'
    const installment_count = proposal.installment_count ? parseInt(proposal.installment_count) : 0;
    const installment_amount = proposal.installment_amount ? parseFloat(proposal.installment_amount) : 0;

    let responseData = {
      project_id: project.project_id,
      proposal_id: proposal.proposal_id,
      project_value,
      payment_mode,
      payments
    };

    if (payment_mode === 'full') {
      const discount = project_value * 0.10;
      const final_amount = project_value * 0.90;
      // Check if paid
      const isPaid = payments.some(p => p.payment_detail === 'Full Payment');
      
      responseData = {
        ...responseData,
        discount: parseFloat(discount.toFixed(2)),
        final_amount: parseFloat(final_amount.toFixed(2)),
        isPaid
      };
    } else {
      // Installments
      // Filter payments that match "Installment <number>"
      const paidInstallmentNumbers = payments
        .filter(p => p.payment_detail.startsWith('Installment '))
        .map(p => {
          const numStr = p.payment_detail.replace('Installment ', '');
          return parseInt(numStr);
        })
        .filter(num => !isNaN(num))
        .sort((a, b) => a - b);

      const total_paid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const total_due = Math.max(0, project_value - total_paid);
      const installments_paid = paidInstallmentNumbers.length;
      const installments_remaining = Math.max(0, installment_count - installments_paid);
      const next_installment_number = installments_paid + 1;

      // Calculate next payment date
      let next_payment_date = null;
      if (project.start_date && next_installment_number <= installment_count) {
        const start = new Date(project.start_date);
        start.setMonth(start.getMonth() + installments_paid);
        next_payment_date = start;
      }

      responseData = {
        ...responseData,
        installment_count,
        installment_amount,
        total_paid: parseFloat(total_paid.toFixed(2)),
        total_due: parseFloat(total_due.toFixed(2)),
        installments_paid,
        installments_remaining,
        paid_installment_numbers: paidInstallmentNumbers,
        next_installment_number,
        next_payment_date
      };
    }

    res.json({
      success: true,
      data: responseData,
      message: 'Project payment details retrieved successfully'
    });
  } catch (err) {
    console.error('Error fetching project payments:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project payments'
    });
  }
};

// Add project payment
exports.addProjectPayment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { payment_detail, installment_number, payment_date } = req.body;

    const project = await Project.findByPk(projectId, {
      include: [{ model: Proposal, as: 'proposal' }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const proposal = project.proposal;
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found for this project'
      });
    }

    const project_value = parseFloat(proposal.project_value);
    const payment_mode = proposal.payment_mode;
    const payDate = payment_date ? new Date(payment_date) : new Date();

    if (payment_mode === 'full') {
      const existingPayment = await Payment.findOne({
        where: {
          proposal_id: proposal.proposal_id,
          payment_detail: 'Full Payment'
        }
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Full payment has already been recorded'
        });
      }

      const final_amount = parseFloat((project_value * 0.90).toFixed(2));
      const payment = await Payment.create({
        proposal_id: proposal.proposal_id,
        payment_date: payDate,
        amount: final_amount,
        payment_detail: 'Full Payment'
      });

      return res.json({
        success: true,
        data: payment,
        message: 'Full payment recorded successfully'
      });
    } else {
      const instNum = parseInt(installment_number);
      if (isNaN(instNum) || instNum <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid installment number is required'
        });
      }

      // Check all existing payments for this proposal
      const existingPayments = await Payment.findAll({
        where: { proposal_id: proposal.proposal_id }
      });

      const paidInstallmentNumbers = existingPayments
        .filter(p => p.payment_detail.startsWith('Installment '))
        .map(p => {
          const numStr = p.payment_detail.replace('Installment ', '');
          return parseInt(numStr);
        })
        .filter(num => !isNaN(num))
        .sort((a, b) => a - b);

      const currentPaidCount = paidInstallmentNumbers.length;
      const nextExpected = currentPaidCount + 1;

      if (instNum !== nextExpected) {
        return res.status(400).json({
          success: false,
          message: `Installments must be paid in sequence. Next expected installment is ${nextExpected}.`
        });
      }

      const installment_amount = parseFloat(proposal.installment_amount);
      const payment = await Payment.create({
        proposal_id: proposal.proposal_id,
        payment_date: payDate,
        amount: installment_amount,
        payment_detail: `Installment ${instNum}`
      });

      return res.json({
        success: true,
        data: payment,
        message: `Installment ${instNum} payment recorded successfully`
      });
    }
  } catch (err) {
    console.error('Error adding project payment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while adding project payment'
    });
  }
};

// Delete latest project payment
exports.deleteProjectPayment = async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;

    const project = await Project.findByPk(projectId, {
      include: [{ model: Proposal, as: 'proposal' }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const proposal = project.proposal;
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    const payment = await Payment.findOne({
      where: {
        payment_id: paymentId,
        proposal_id: proposal.proposal_id
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    if (proposal.payment_mode === 'installments' && payment.payment_detail.startsWith('Installment ')) {
      const allPayments = await Payment.findAll({
        where: { proposal_id: proposal.proposal_id }
      });
      
      const paidInstallmentNumbers = allPayments
        .filter(p => p.payment_detail.startsWith('Installment '))
        .map(p => {
          const numStr = p.payment_detail.replace('Installment ', '');
          return parseInt(numStr);
        })
        .filter(num => !isNaN(num))
        .sort((a, b) => a - b);

      const deletedInstNum = parseInt(payment.payment_detail.replace('Installment ', ''));
      const maxPaid = Math.max(...paidInstallmentNumbers);
      
      if (deletedInstNum !== maxPaid) {
        return res.status(400).json({
          success: false,
          message: `To maintain sequence integrity, you can only delete the latest paid installment (${maxPaid}).`
        });
      }
    }

    await payment.destroy();

    res.json({
      success: true,
      message: 'Payment record deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting project payment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project payment'
    });
  }
};

// Update project payment date
exports.updateProjectPayment = async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;
    const { payment_date } = req.body;

    if (!payment_date) {
      return res.status(400).json({
        success: false,
        message: 'Payment date is required'
      });
    }

    const project = await Project.findByPk(projectId, {
      include: [{ model: Proposal, as: 'proposal' }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const proposal = project.proposal;
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    const payment = await Payment.findOne({
      where: {
        payment_id: paymentId,
        proposal_id: proposal.proposal_id
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    payment.payment_date = new Date(payment_date);
    await payment.save();

    res.json({
      success: true,
      data: payment,
      message: 'Payment date updated successfully'
    });
  } catch (err) {
    console.error('Error updating project payment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating project payment'
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete associated ProjectProgress entries
    const ProjectProgress = require('../models/ProjectProgress');
    await ProjectProgress.destroy({
      where: { project_id: projectId }
    });

    // Delete associated legacy Progress entries
    const Progress = require('../models/progress');
    await Progress.destroy({
      where: { project_id: projectId }
    });

    // Finally delete the project
    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project',
      details: err.message
    });
  }
};