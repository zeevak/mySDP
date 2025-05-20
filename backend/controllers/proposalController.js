// controllers/proposalController.js
const Proposal = require('../models/Proposal');
const Customer = require('../models/Customer');
const { Op } = require('sequelize');

/**
 * Get all customers for proposal creation
 * @route GET /api/proposal/customers
 * @access Private (Staff, Admin)
 */
exports.getCustomersForProposal = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: {
        exclude: ['password_hash']
      },
      order: [['full_name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (err) {
    console.error('Error fetching customers for proposal:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customers'
    });
  }
};

/**
 * Get project durations based on project type
 * @route GET /api/proposal/durations/:projectType
 * @access Private (Staff, Admin)
 */
exports.getProjectDurations = async (req, res) => {
  try {
    const { projectType } = req.params;
    let durations = [];

    // Set durations based on project type
    switch (projectType) {
      case 'Agarwood':
        durations = [4, 8];
        break;
      case 'Sandalwood':
        durations = [3, 6, 9, 12, 15];
        break;
      case 'Vanilla':
        durations = [3, 5, 7, 9, 11];
        break;
      default:
        durations = [1, 2, 3, 4, 5];
    }

    res.status(200).json({
      success: true,
      data: durations
    });
  } catch (err) {
    console.error('Error fetching project durations:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve project durations'
    });
  }
};

/**
 * Calculate installment details
 * @route POST /api/proposal/calculate-installments
 * @access Private (Staff, Admin)
 */
exports.calculateInstallments = async (req, res) => {
  try {
    const { projectValue, projectDuration, paymentMode } = req.body;

    if (!projectValue || !projectDuration) {
      return res.status(400).json({
        success: false,
        error: 'Project value and duration are required'
      });
    }

    let result = {};

    if (paymentMode === 'full') {
      // Apply 10% discount for full payment
      const discount = projectValue * 0.1;
      const discountedAmount = projectValue - discount;

      result = {
        originalAmount: parseFloat(projectValue),
        discountPercentage: 10,
        discountAmount: parseFloat(discount.toFixed(2)),
        finalAmount: parseFloat(discountedAmount.toFixed(2)),
        installments: null
      };
    } else {
      // Calculate monthly installments
      const installmentCount = projectDuration * 12; // Monthly installments for the duration in years
      const installmentAmount = projectValue / installmentCount;

      result = {
        originalAmount: parseFloat(projectValue),
        discountPercentage: 0,
        discountAmount: 0,
        finalAmount: parseFloat(projectValue),
        installments: {
          count: installmentCount,
          amount: parseFloat(installmentAmount.toFixed(2))
        }
      };
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error calculating installments:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate installments'
    });
  }
};

/**
 * Create a new proposal
 * @route POST /api/proposal
 * @access Private (Staff, Admin)
 */
exports.createProposal = async (req, res) => {
  try {
    const {
      customer_id,
      project_type,
      project_duration,
      project_value,
      payment_mode,
      installment_count,
      installment_amount
    } = req.body;

    console.log('Received proposal data:', {
      customer_id,
      project_type,
      project_duration,
      project_value,
      payment_mode,
      installment_count,
      installment_amount
    });

    // Validate required fields
    if (!customer_id || !project_type || !project_duration || !project_value || !payment_mode) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate customer exists
    console.log('Looking for customer with ID:', customer_id);
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      console.log('Customer not found with ID:', customer_id);
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    console.log('Customer found:', customer.full_name);

    // Create proposal
    console.log('Creating proposal with data:', {
      customer_id,
      project_type,
      project_duration,
      project_value,
      payment_mode,
      installment_count: payment_mode === 'installments' ? installment_count : null,
      installment_amount: payment_mode === 'installments' ? installment_amount : null
    });

    const proposal = await Proposal.create({
      customer_id,
      project_type,
      project_duration,
      project_value,
      payment_mode,
      installment_count: payment_mode === 'installments' ? installment_count : null,
      installment_amount: payment_mode === 'installments' ? installment_amount : null,
      proposal_date: new Date()
    });

    console.log('Proposal created successfully:', proposal.proposal_id);
    res.status(201).json({
      success: true,
      data: proposal
    });
  } catch (err) {
    console.error('Error creating proposal:', err);
    // Send more detailed error message
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create proposal'
    });
  }
};
