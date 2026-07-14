// controllers/customerAuthController.js
/**
 * Customer Authentication Controller
 * Handles customer registration, login, and profile management
 */

// Import required dependencies
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
// Import database models
const { Customer, CustomerLand, Proposal, Project, Payment } = require("../models");
// Import email service
const emailService = require("../utils/emailService");
// Load environment variables
require("dotenv").config();

/**
 * Customer Registration
 * Registers a new customer in the system
 * @param {Object} req - Express request object with customer details in body
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    console.log('Customer registration request body:', req.body);

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

    // Check if customer with this email already exists
    let customer = await Customer.findOne({ where: { email } });
    if (customer)
      return res.status(400).json({
        success: false,
        error: "Customer already exists"
      });

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new customer record in database with all fields
    customer = await Customer.create({
      title,
      name_with_ini,
      full_name,
      f_name,
      l_name,
      date_of_birth: date_of_birth || null,
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
      password_hash: hashedPassword,
    });

    // Generate JWT token for authentication
    const payload = { id: customer.customer_id, role: "customer" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Prepare user data to return (excluding sensitive information)
    const userData = {
      id: customer.customer_id,
      email: customer.email,
      name: customer.full_name,
    };

    // Send welcome email with credentials
    try {
      await emailService.sendWelcomeEmail(customer, password);
      console.log(`Welcome email sent to ${customer.email}`);

      // Also notify staff about new customer registration
      await emailService.sendStaffNotificationEmail(customer);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue with registration process even if email fails
    }

    // Send successful response with token and user data
    res.json({
      success: true,
      message: "Registration successful. Your login credentials have been sent to your email.",
      token,
      user: userData,
      expiresIn: 3600 // Token expiration in seconds
    });

    console.log(`User ${customer.email} registered at ${new Date().toISOString()}`);
  } catch (err) {
    // Handle errors
    console.error("Registration Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during registration"
    });
  }
};

/**
 * Customer Login
 * Authenticates a customer and provides a JWT token
 * @param {Object} req - Express request object with login credentials
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  // Extract login credentials from request body
  const { email, password } = req.body;
  try {
    // Find customer by email
    const customer = await Customer.findOne({ where: { email } });
    if (!customer)
      return res.status(401).json({
        success: false,
        error: "Authentication failed - user not found"
      });

    // Verify password
    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch)
      return res.status(401).json({
        success: false,
        error: "Authentication failed - invalid password"
      });

    // Generate JWT token with customer ID and role
    const payload = { id: customer.customer_id, role: "customer" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Prepare user data to return (excluding sensitive information)
    const userData = {
      id: customer.customer_id,
      email: customer.email,
      name: customer.full_name,
    };

    // Send successful response with token and user data
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
      expiresIn: 3600 // Token expiration in seconds
    });

    console.log(`Customer ${customer.email} logged in at ${new Date().toISOString()}`);
  } catch (err) {
    // Handle errors
    console.error("Customer Login Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during authentication"
    });
  }
};

/**
 * Get Current Customer
 * Retrieves the profile of the currently authenticated customer
 * @param {Object} req - Express request object with user info from JWT token
 * @param {Object} res - Express response object
 */
exports.getCurrentCustomer = async (req, res) => {
  try {
    // Get user ID from the JWT token (set by auth middleware)
    const userId = req.user.id;

    // Fetch customer data including their lands
    const customer = await Customer.findByPk(userId, {
      include: [
        {
          model: CustomerLand,
          as: 'customer_land'  // Change 'lands' to 'customer_land' to match model definition
        }
      ],
      attributes: { exclude: ['password_hash'] } // Don't send password hash for security
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found"
      });
    }

    // Format the response data with all customer profile fields
    const userData = {
      id: customer.customer_id,
      title: customer.title,
      nameWithInitials: customer.name_with_ini,
      fullName: customer.full_name,
      firstName: customer.f_name,
      lastName: customer.l_name,
      dateOfBirth: customer.date_of_birth,
      nicNumber: customer.nic_number,
      addressLine1: customer.add_line_1,
      addressLine2: customer.add_line_2,
      addressLine3: customer.add_line_3,
      city: customer.city,
      district: customer.district,
      province: customer.province,
      phoneNumber1: customer.phone_no_1,
      phoneNumber2: customer.phone_no_2,
      email: customer.email,
      lands: customer.customer_land || [] // Change to customer_land to match the association
    };

    return res.json({
      success: true,
      data: userData
    });
  } catch (err) {
    // Handle errors
    console.error("Get Current Customer Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching customer data"
    });
  }
};

/**
 * Change Password
 * Changes the password of the currently authenticated customer
 * @param {Object} req - Express request object with password details
 * @param {Object} res - Express response object
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match"
      });
    }

    // Find customer
    const customer = await Customer.findByPk(userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password"
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    customer.password_hash = hashedPassword;
    await customer.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

    console.log(`Password changed for customer ${customer.email} at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while changing password"
    });
  }
};

/**
 * Get Investment Summary
 * Retrieves the investment and payment summary details for the currently authenticated customer
 * @param {Object} req - Express request object with user info from JWT token
 * @param {Object} res - Express response object
 */
exports.getInvestmentSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all approved proposals for the customer, including their associated Project
    const proposals = await Proposal.findAll({
      where: {
        customer_id: userId,
        status: 'Approved'
      },
      include: [
        {
          model: Project,
          required: false
        }
      ]
    });

    if (!proposals || proposals.length === 0) {
      return res.json({
        success: true,
        data: {
          totalInvested: 0,
          totalPaid: 0,
          isInstallment: false,
          nextPaymentDate: null,
          nextPaymentAmount: 0,
          recentActivity: []
        }
      });
    }

    // Get all payments for these proposals
    const proposalIds = proposals.map(p => p.proposal_id);
    const payments = await Payment.findAll({
      where: {
        proposal_id: proposalIds
      },
      order: [['payment_date', 'DESC']]
    });

    let totalInvested = 0;
    let isInstallment = false;
    let nextPaymentDate = null;
    let nextPaymentAmount = 0;
    const projectsList = [];

    for (const proposal of proposals) {
      const projectValue = parseFloat(proposal.project_value) || 0;
      const projectTotalInvested = proposal.payment_mode === 'full' ? projectValue * 0.90 : projectValue;
      totalInvested += projectTotalInvested;

      const proposalPayments = payments.filter(p => p.proposal_id === proposal.proposal_id);
      const projectTotalPaid = proposalPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

      const projectIsInstallment = proposal.payment_mode === 'installments';
      if (projectIsInstallment) {
        isInstallment = true;
      }

      let projectNextPaymentDate = null;
      let projectNextPaymentAmount = 0;

      if (projectIsInstallment) {
        const project = proposal.project;
        const installmentCount = proposal.installment_count ? parseInt(proposal.installment_count) : 0;
        const installmentAmount = proposal.installment_amount ? parseFloat(proposal.installment_amount) : 0;

        const paidInstallmentNumbers = proposalPayments
          .filter(p => p.payment_detail && p.payment_detail.startsWith('Installment '))
          .map(p => {
            const numStr = p.payment_detail.replace('Installment ', '');
            return parseInt(numStr);
          })
          .filter(num => !isNaN(num))
          .sort((a, b) => a - b);

        const installmentsPaid = paidInstallmentNumbers.length;
        const nextInstallmentNumber = installmentsPaid + 1;

        if (project && project.start_date && nextInstallmentNumber <= installmentCount) {
          const start = new Date(project.start_date);
          start.setMonth(start.getMonth() + installmentsPaid);
          projectNextPaymentDate = start;
          projectNextPaymentAmount = installmentAmount;
        }
      }

      const projectRecentActivity = proposalPayments.map(p => ({
        payment_id: p.payment_id,
        payment_detail: p.payment_detail,
        amount: p.amount,
        payment_date: p.payment_date
      }));

      projectsList.push({
        proposalId: proposal.proposal_id,
        projectType: proposal.project_type,
        paymentMode: proposal.payment_mode,
        totalInvested: parseFloat(projectTotalInvested.toFixed(2)),
        totalPaid: parseFloat(projectTotalPaid.toFixed(2)),
        isInstallment: projectIsInstallment,
        nextPaymentDate: projectNextPaymentDate,
        nextPaymentAmount: parseFloat(projectNextPaymentAmount.toFixed(2)),
        recentActivity: projectRecentActivity,
        projectDetails: proposal.project ? {
          projectId: proposal.project.project_id,
          status: proposal.project.status,
          startDate: proposal.project.start_date,
          progressPercentage: proposal.project.progress_percentage
        } : null
      });
    }

    // Calculate total paid across all payments
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // Calculate overall next payment details from all projects
    const upcomingPayments = projectsList
      .filter(p => p.isInstallment && p.nextPaymentDate !== null)
      .map(p => ({
        date: p.nextPaymentDate,
        amount: p.nextPaymentAmount
      }));

    if (upcomingPayments.length > 0) {
      upcomingPayments.sort((a, b) => a.date - b.date);
      nextPaymentDate = upcomingPayments[0].date;
      nextPaymentAmount = upcomingPayments[0].amount;
    }

    // Format overall recent activity list
    const recentActivity = payments.map(p => ({
      payment_id: p.payment_id,
      payment_detail: p.payment_detail,
      amount: p.amount,
      payment_date: p.payment_date
    }));

    return res.json({
      success: true,
      data: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        isInstallment,
        nextPaymentDate,
        nextPaymentAmount: parseFloat(nextPaymentAmount.toFixed(2)),
        recentActivity,
        projects: projectsList
      }
    });

  } catch (err) {
    console.error("Get Investment Summary Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching investment summary"
    });
  }
};


