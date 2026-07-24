// controllers/customerManagementController.js
/**
 * Customer Management Controller
 * Handles CRUD operations for customers (staff/admin only)
 */

const Customer = require('../models/Customer');
const CustomerLand = require('../models/CustomerLand');
const bcrypt = require('bcryptjs');
const emailService = require('../utils/emailService');
const { Op } = require('sequelize');

// Define exports at the beginning
const customerManagementController = {
  /**
   * Get all customers
   * @route GET /api/staff/customers
   * @access Private (Staff, Admin)
   */
  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll({
        attributes: {
          exclude: ['password_hash']
        },
        include: [
          {
            model: CustomerLand,
            as: 'customer_land',
            attributes: ['customer_land_id', 'province', 'district', 'city']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      const formattedCustomers = customers.map(c => {
        const plain = c.toJSON();
        return {
          ...plain,
          lands: plain.customer_land || []
        };
      });

      res.status(200).json({
        success: true,
        count: formattedCustomers.length,
        data: formattedCustomers
      });
    } catch (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve customers'
      });
    }
  },

  /**
   * Get customer by ID
   * @route GET /api/staff/customers/:id
   * @access Private (Staff, Admin)
   */
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching customer with ID: ${id}`);

      // Use a simpler query without the association to avoid circular dependency issues
      const customer = await Customer.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
      });

      if (!customer) {
        console.log(`Customer with ID ${id} not found`);
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Fetch customer lands
      const customerLands = await CustomerLand.findAll({
        where: { customer_id: id }
      });

      // Fetch customer proposals
      const Proposal = require('../models/Proposal');
      const customerProposals = await Proposal.findAll({
        where: { customer_id: id },
        include: [
          {
            model: CustomerLand,
            as: 'CustomerLand',
            attributes: ['city', 'district', 'province', 'land_size']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      // Fetch customer projects
      const Project = require('../models/Project');
      const customerProjects = await Project.findAll({
        include: [
          {
            model: Proposal,
            where: { customer_id: id },
            attributes: ['proposal_id', 'project_type', 'project_duration', 'project_value']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      // Fetch customer payments (linked to proposals)
      const Payment = require('../models/Payment');
      const proposalIds = customerProposals.map(p => p.proposal_id);
      const customerPayments = proposalIds.length > 0 ? await Payment.findAll({
        where: { proposal_id: proposalIds },
        order: [['payment_date', 'DESC']]
      }) : [];

      // Fetch customer documents
      const CustomerDocument = require('../models/CustomerDocument');
      const customerDocuments = await CustomerDocument.findAll({
        where: { customer_id: id },
        order: [['created_at', 'DESC']]
      });

      // Fetch customer requests
      const Request = require('../models/Request');
      const customerRequests = await Request.findAll({
        where: { customer_id: id },
        order: [['request_date', 'DESC']]
      });

      console.log(`Customer found: ${customer.full_name}`);
      res.status(200).json({
        success: true,
        data: {
          ...customer.toJSON(),
          lands: customerLands,
          proposals: customerProposals,
          projects: customerProjects,
          payments: customerPayments,
          documents: customerDocuments,
          requests: customerRequests
        }
      });
    } catch (err) {
      console.error('Error fetching customer:', err);
      console.error(err.stack); // Log the full stack trace
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve customer',
        details: err.message
      });
    }
  },

  /**
   * Update customer
   * @route PUT /api/staff/customers/:id
   * @access Private (Staff, Admin)
   */
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        name_with_ini,
        full_name,
        f_name,
        l_name,
        date_of_birth,
        nic_number,
        add_line_1,
        add_line_2,
        add_line_3,
        city,
        district,
        province,
        phone_no_1,
        phone_no_2,
        email,
        password
      } = req.body;

      // Check if customer exists
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Check if email is being changed and already exists
      if (email && email !== customer.email) {
        const existingEmail = await Customer.findOne({
          where: {
            email,
            customer_id: { [Op.ne]: id }
          }
        });

        if (existingEmail) {
          return res.status(400).json({
            success: false,
            error: 'Email already exists'
          });
        }
      }

      // Update customer fields
      const updateData = {
        title: title || customer.title,
        name_with_ini: name_with_ini || customer.name_with_ini,
        full_name: full_name || customer.full_name,
        f_name: f_name || customer.f_name,
        l_name: l_name || customer.l_name,
        date_of_birth: date_of_birth || customer.date_of_birth,
        nic_number: nic_number || customer.nic_number,
        add_line_1: add_line_1 !== undefined ? add_line_1 : customer.add_line_1,
        add_line_2: add_line_2 !== undefined ? add_line_2 : customer.add_line_2,
        add_line_3: add_line_3 !== undefined ? add_line_3 : customer.add_line_3,
        city: city !== undefined ? city : customer.city,
        district: district !== undefined ? district : customer.district,
        province: province !== undefined ? province : customer.province,
        phone_no_1: phone_no_1 || customer.phone_no_1,
        phone_no_2: phone_no_2 !== undefined ? phone_no_2 : customer.phone_no_2,
        email: email || customer.email
      };

      // Update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password_hash = await bcrypt.hash(password, salt);

        // Send email notification about password change
        try {
          await emailService.sendWelcomeEmail({
            ...updateData,
            customer_id: id
          }, password);
          console.log(`Password update email sent to ${updateData.email}`);
        } catch (emailError) {
          console.error('Error sending password update email:', emailError);
          // Continue even if email fails
        }
      }

      // Update customer in database
      await Customer.update(updateData, {
        where: { customer_id: id }
      });

      // Get updated customer data
      const updatedCustomer = await Customer.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
      });

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer
      });
    } catch (err) {
      console.error('Error updating customer:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to update customer'
      });
    }
  },

  /**
   * Delete customer
   * @route DELETE /api/staff/customers/:id
   * @access Private (Staff, Admin)
   */
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if customer exists
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // 1. Find all proposals for the customer
      const Proposal = require('../models/Proposal');
      const proposals = await Proposal.findAll({ where: { customer_id: id } });

      // 2. For each proposal, delete associated project and its progress logs
      for (const proposal of proposals) {
        const Project = require('../models/Project');
        const project = await Project.findOne({ where: { proposal_id: proposal.proposal_id } });
        if (project) {
          const ProjectProgress = require('../models/ProjectProgress');
          await ProjectProgress.destroy({ where: { project_id: project.project_id } });

          const Progress = require('../models/progress');
          await Progress.destroy({ where: { project_id: project.project_id } });

          await project.destroy();
        }
        await proposal.destroy();
      }

      // 3. Delete all lands for this customer
      await CustomerLand.destroy({ where: { customer_id: id } });

      // 4. Finally delete the customer record
      await customer.destroy();

      res.status(200).json({
        success: true,
        message: 'Customer and all associated lands, proposals, and projects deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to delete customer',
        details: err.message
      });
    }
  },

  /**
   * Get customer lands
   * @route GET /api/staff/customers/:customerId/lands
   * @access Private (Staff, Admin)
   */
  getCustomerLands: async (req, res) => {
    try {
      const { customerId } = req.params;

      // Check if customer exists
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Fetch customer lands
      const customerLands = await CustomerLand.findAll({
        where: { customer_id: customerId }
      });

      res.status(200).json({
        success: true,
        count: customerLands.length,
        data: customerLands
      });
    } catch (err) {
      console.error('Error fetching customer lands:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve customer lands'
      });
    }
  },

  /**
   * Add new customer land
   * @route POST /api/staff/customers/:customerId/lands
   * @access Private (Staff, Admin)
   */
  addCustomerLand: async (req, res) => {
    try {
      const { customerId } = req.params;
      const {
        province,
        district,
        city,
        climate_zone,
        land_shape,
        has_water,
        soil_type,
        has_stones,
        has_landslide_risk,
        has_forestry,
        land_size
      } = req.body;

      // Check if customer exists
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found'
        });
      }

      // Create new customer land
      const newLand = await CustomerLand.create({
        customer_id: customerId,
        province,
        district,
        city,
        climate_zone,
        land_shape,
        has_water,
        soil_type,
        has_stones,
        has_landslide_risk,
        has_forestry,
        land_size
      });

      res.status(201).json({
        success: true,
        message: 'Customer land added successfully',
        data: newLand
      });
    } catch (err) {
      console.error('Error adding customer land:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to add customer land',
        details: err.message
      });
    }
  },
  /**
   * Get master analytics payload for customer reports
   * @route GET /api/staff/customers/analytics/master
   * @access Private (Staff, Admin)
   */
  getCustomerAnalyticsMaster: async (req, res) => {
    try {
      const Customer = require('../models/Customer');
      const CustomerLand = require('../models/CustomerLand');
      const Proposal = require('../models/Proposal');
      const Project = require('../models/Project');
      const Payment = require('../models/Payment');

      const customers = await Customer.findAll({
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']]
      });

      const lands = await CustomerLand.findAll({
        order: [['customer_land_id', 'ASC']]
      });

      const proposals = await Proposal.findAll({
        order: [['created_at', 'DESC']]
      });

      const projects = await Project.findAll({
        order: [['created_at', 'DESC']]
      });

      const payments = await Payment.findAll({
        order: [['payment_date', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: {
          customers,
          lands,
          proposals,
          projects,
          payments
        }
      });
    } catch (err) {
      console.error('Error fetching customer analytics master data:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve analytics master data',
        details: err.message
      });
    }
  }
};

module.exports = customerManagementController;
