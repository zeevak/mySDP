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
const { Customer, CustomerLand, Proposal, Project, Payment, CustomerDocument } = require("../models");
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

    // Get all approved proposals for the customer, including their associated Project and CustomerLand
    const proposals = await Proposal.findAll({
      where: {
        customer_id: userId,
        status: 'Approved'
      },
      include: [
        {
          model: Project,
          required: false
        },
        {
          model: CustomerLand,
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
          recentActivity: [],
          projects: []
        }
      });
    }

    // Ensure a Project record exists for every approved proposal
    for (const proposal of proposals) {
      if (!proposal.project) {
        const existingProject = await Project.findOne({
          where: { proposal_id: proposal.proposal_id }
        });
        if (!existingProject) {
          const newProj = await Project.create({
            proposal_id: proposal.proposal_id,
            status: 'Yet To Start',
            progress_percentage: 0,
            last_updated: new Date()
          });
          proposal.project = newProj;
        } else {
          proposal.project = existingProject;
        }
      }
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

      const land = proposal.customer_land || proposal.CustomerLand;
      const district = land?.district || '';
      const city = land?.city || '';
      const landLocation = (district && city) ? `${district}, ${city}` : (district || city || 'N/A');

      projectsList.push({
        proposalId: proposal.proposal_id,
        projectId: proposal.project ? proposal.project.project_id : null,
        projectType: proposal.project_type,
        paymentMode: proposal.payment_mode,
        district: district,
        city: city,
        landLocation: landLocation,
        landSize: land?.land_size || null,
        projectDuration: proposal.project_duration,
        projectValue: projectValue,
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
          endDate: proposal.project.end_date,
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

    // Also fetch any pending or under-review proposals for this customer
    const pendingProposals = await Proposal.findAll({
      where: {
        customer_id: userId,
        status: { [Op.in]: ['Pending', 'Under Review'] }
      },
      include: [
        {
          model: CustomerLand,
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const pendingList = pendingProposals.map(p => {
      const land = p.customer_land || p.CustomerLand;
      const district = land?.district || '';
      const city = land?.city || '';
      const landLocation = (district && city) ? `${district}, ${city}` : (district || city || 'N/A');

      return {
        proposalId: p.proposal_id,
        projectType: p.project_type,
        projectDuration: p.project_duration,
        projectValue: parseFloat(p.project_value || 0),
        paymentMode: p.payment_mode,
        status: p.status,
        proposalDate: p.proposal_date || p.created_at,
        landLocation: landLocation,
        landSize: land?.land_size || null
      };
    });

    return res.json({
      success: true,
      data: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        isInstallment,
        nextPaymentDate,
        nextPaymentAmount: parseFloat(nextPaymentAmount.toFixed(2)),
        recentActivity,
        projects: projectsList,
        pendingProposals: pendingList
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

// Submit a new investment proposal (creates land + proposal with status 'Pending')
exports.submitNewInvestment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      // Land details
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
      land_size,
      // Proposal details
      project_type,
      project_duration,
      project_value,
      payment_mode
    } = req.body;

    if (!project_type || !project_duration || !project_value || !land_size) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Land size, Project type, duration, value)"
      });
    }

    // 1. Create land record for customer
    const land = await CustomerLand.create({
      customer_id: userId,
      province: province || null,
      district: district || null,
      city: city || null,
      climate_zone: climate_zone || null,
      land_shape: land_shape || null,
      has_water: !!has_water,
      soil_type: soil_type || null,
      has_stones: !!has_stones,
      has_landslide_risk: !!has_landslide_risk,
      has_forestry: !!has_forestry,
      land_size: parseFloat(land_size)
    });

    // 2. Calculate installment values if payment_mode is 'installments'
    let installment_count = null;
    let installment_amount = null;
    if (payment_mode === 'installments') {
      installment_count = parseInt(project_duration) * 4;
      installment_amount = parseFloat((parseFloat(project_value) / installment_count).toFixed(2));
    }

    // 3. Create proposal record with status 'Pending'
    const proposal = await Proposal.create({
      customer_id: userId,
      customer_land_id: land.customer_land_id,
      project_type,
      project_duration: parseInt(project_duration),
      project_value: parseFloat(project_value),
      payment_mode: payment_mode || 'full',
      installment_count,
      installment_amount,
      proposal_date: new Date(),
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: "Investment proposal submitted successfully! It is now pending staff review.",
      data: {
        proposal_id: proposal.proposal_id,
        customer_land_id: land.customer_land_id,
        status: proposal.status
      }
    });
  } catch (error) {
    console.error("Error submitting customer investment proposal:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit investment proposal. Please try again."
    });
  }
};

// Upload a document with a caption
exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No document file uploaded"
      });
    }

    if (!caption || !caption.trim()) {
      return res.status(400).json({
        success: false,
        message: "Document caption is required (e.g. Land deed, ID, Proof of Address)"
      });
    }

    const newDoc = await CustomerDocument.create({
      customer_id: userId,
      caption: caption.trim(),
      file_name: req.file.originalname,
      file_path: `/uploads/documents/${req.file.filename}`,
      file_type: req.file.mimetype || req.file.filename.split('.').pop(),
      file_size: req.file.size
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: newDoc
    });
  } catch (err) {
    console.error("Upload Document Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to upload document"
    });
  }
};

// Get all documents for current customer
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await CustomerDocument.findAll({
      where: { customer_id: userId },
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      data: documents
    });
  } catch (err) {
    console.error("Get Documents Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve documents"
    });
  }
};

// Delete a customer document
exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    const doc = await CustomerDocument.findOne({
      where: {
        document_id: documentId,
        customer_id: userId
      }
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    await doc.destroy();
    return res.json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (err) {
    console.error("Delete Document Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document"
    });
  }
};

// Get customer documents for staff view
exports.getStaffCustomerDocuments = async (req, res) => {
  try {
    const { customerId } = req.params;
    const documents = await CustomerDocument.findAll({
      where: { customer_id: customerId },
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      data: documents
    });
  } catch (err) {
    console.error("Get Staff Customer Documents Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customer documents for staff"
    });
  }
};


