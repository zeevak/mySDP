// controllers/proposalController.js
const Proposal = require('../models/Proposal');
const Customer = require('../models/Customer');
const CustomerLand = require('../models/CustomerLand');
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
      customer_land_id,
      project_type,
      project_duration,
      project_value,
      payment_mode,
      installment_count,
      installment_amount
    } = req.body;

    console.log('Received proposal data:', {
      customer_id,
      customer_land_id,
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

    // Validate customer_land_id if provided
    if (customer_land_id) {
      // Validate customer land exists and belongs to the customer
      const customerLand = await CustomerLand.findOne({
        where: { 
          customer_land_id: customer_land_id,
          customer_id: customer_id
        }
      });
      
      if (!customerLand) {
        return res.status(404).json({
          success: false,
          error: 'Customer land not found or does not belong to this customer'
        });
      }
      console.log('Customer land found:', `${customerLand.city}, ${customerLand.district}`);
    }

    // Create proposal
    console.log('Creating proposal with data:', {
      customer_id,
      customer_land_id: customer_land_id || null,
      project_type,
      project_duration,
      project_value,
      payment_mode,
      installment_count: payment_mode === 'installments' ? installment_count : null,
      installment_amount: payment_mode === 'installments' ? installment_amount : null
    });

    const proposalData = {
      customer_id,
      project_type,
      project_duration,
      project_value,
      payment_mode,
      installment_count: payment_mode === 'installments' ? installment_count : null,
      installment_amount: payment_mode === 'installments' ? installment_amount : null,
      proposal_date: new Date()
    };

    // Add customer_land_id only if provided
    if (customer_land_id) {
      proposalData.customer_land_id = customer_land_id;
    }

    const proposal = await Proposal.create(proposalData);

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

/**
 * Get all proposals
 * @route GET /api/proposal
 * @access Private (Staff, Admin)
 */
exports.getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.findAll({
      include: [
        {
          model: Customer,
          as: 'Customer',
          attributes: ['full_name', 'email', 'phone_no_1'],
          required: true
        },
        {
          model: CustomerLand,
          as: 'CustomerLand',
          attributes: ['city', 'district', 'province', 'land_size', 'climate_zone'],
          required: false // Make this optional for existing proposals without land
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Transform the data to include customer_name and land_info
    const transformedProposals = proposals.map(proposal => ({
      ...proposal.toJSON(),
      customer_name: proposal.Customer ? proposal.Customer.full_name : 'Unknown',
      land_info: proposal.CustomerLand ? 
        `${proposal.CustomerLand.city}, ${proposal.CustomerLand.district}, ${proposal.CustomerLand.province} (${proposal.CustomerLand.land_size} acres)` : 
        'No land selected',
      needs_land_selection: !proposal.customer_land_id // Flag to indicate if land selection is needed
    }));

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: transformedProposals
    });
  } catch (err) {
    console.error('Error fetching proposals:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve proposals'
    });
  }
};

/**
 * Get single proposal
 * @route GET /api/proposal/:id
 * @access Private (Staff, Admin)
 */
exports.getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: 'Customer',
          attributes: ['full_name', 'email', 'phone_no_1', 'add_line_1', 'add_line_2', 'city'],
          required: true
        },
        {
          model: CustomerLand,
          as: 'CustomerLand',
          attributes: ['city', 'district', 'province', 'land_size', 'climate_zone', 'soil_type'],
          required: false // Make this optional for existing proposals without land
        }
      ]
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (err) {
    console.error('Error fetching proposal:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve proposal'
    });
  }
};

/**
 * Update proposal
 * @route PATCH /api/proposal/:id
 * @access Private (Staff, Admin)
 */
exports.updateProposal = async (req, res) => {
  try {
    const {
      project_type,
      project_duration,
      project_value,
      payment_mode,
      status,
      installment_count,
      installment_amount
    } = req.body;

    const proposal = await Proposal.findByPk(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    // Update the proposal
    const updatedProposal = await proposal.update({
      project_type,
      project_duration,
      project_value,
      payment_mode,
      status,
      installment_count,
      installment_amount
    });

    res.status(200).json({
      success: true,
      data: updatedProposal
    });
  } catch (err) {
    console.error('Error updating proposal:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update proposal'
    });
  }
};

/**
 * Update proposal status
 * @route PATCH /api/proposal/:id/status
 * @access Private (Staff, Admin)
 */
exports.updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const proposal = await Proposal.findByPk(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    // Update only the status
    const updatedProposal = await proposal.update({ status });

    // If proposal is approved, create a project for it automatically
    if (status === 'Approved') {
      const Project = require('../models/Project');
      
      // Check if project already exists
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
        console.log(`Project created for approved proposal ${proposal.proposal_id}`);
      }
    }

    res.status(200).json({
      success: true,
      data: updatedProposal
    });
  } catch (err) {
    console.error('Error updating proposal status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update proposal status'
    });
  }
};

/**
 * Delete proposal
 * @route DELETE /api/proposal/:id
 * @access Private (Staff, Admin)
 */
exports.deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByPk(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    await proposal.destroy();

    res.status(200).json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting proposal:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete proposal'
    });
  }
};

/**
 * Get customer lands for proposal creation
 * @route GET /api/proposal/customer-lands/:customerId
 * @access Private (Staff, Admin)
 */
exports.getCustomerLands = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Get all lands for this customer
    const customerLands = await CustomerLand.findAll({
      where: { customer_id: customerId },
      order: [['customer_land_id', 'ASC']]
    });

    // Format the response to include land description
    const formattedLands = customerLands.map(land => ({
      customer_land_id: land.customer_land_id,
      customer_id: land.customer_id,
      location: `${land.city}, ${land.district}, ${land.province}`,
      land_size: land.land_size,
      climate_zone: land.climate_zone,
      soil_type: land.soil_type,
      has_water: land.has_water,
      description: `${land.land_size} acres in ${land.city}, ${land.district} (${land.climate_zone})`
    }));

    res.status(200).json({
      success: true,
      count: formattedLands.length,
      data: formattedLands
    });
  } catch (err) {
    console.error('Error fetching customer lands:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve customer lands'
    });
  }
};

/**
 * Update proposal land selection
 * @route PATCH /api/proposal/:id/land
 * @access Private (Staff, Admin)
 */
exports.updateProposalLand = async (req, res) => {
  try {
    const { customer_land_id } = req.body;
    const proposalId = req.params.id;

    // Validate required fields
    if (!customer_land_id) {
      return res.status(400).json({
        success: false,
        error: 'Customer land ID is required'
      });
    }

    // Find the proposal
    const proposal = await Proposal.findByPk(proposalId);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    // Validate that the land belongs to the customer
    const customerLand = await CustomerLand.findOne({
      where: { 
        customer_land_id: customer_land_id,
        customer_id: proposal.customer_id
      }
    });
    
    if (!customerLand) {
      return res.status(404).json({
        success: false,
        error: 'Customer land not found or does not belong to this customer'
      });
    }

    // Update the proposal
    await proposal.update({ customer_land_id });

    // Fetch the updated proposal with associations
    const updatedProposal = await Proposal.findByPk(proposalId, {
      include: [
        {
          model: Customer,
          as: 'Customer',
          attributes: ['full_name', 'email', 'phone_no_1']
        },
        {
          model: CustomerLand,
          as: 'CustomerLand',
          attributes: ['city', 'district', 'province', 'land_size', 'climate_zone']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Proposal land selection updated successfully',
      data: updatedProposal
    });
  } catch (err) {
    console.error('Error updating proposal land:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update proposal land selection'
    });
  }
};
