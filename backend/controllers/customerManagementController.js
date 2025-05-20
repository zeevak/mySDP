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
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
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

      // Fetch customer lands separately if needed
      // const customerLands = await CustomerLand.findAll({
      //   where: { customer_id: id }
      // });

      console.log(`Customer found: ${customer.full_name}`);
      res.status(200).json({
        success: true,
        data: customer
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

      // Delete customer
      await customer.destroy();

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to delete customer'
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
  }
};

module.exports = customerManagementController;
