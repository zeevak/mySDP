// controllers/staffAuthController.js
/**
 * Staff Authentication Controller
 * Handles staff login and profile management
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Role = require('../models/Role');
require('dotenv').config();

/**
 * Staff Login
 * Authenticates staff members (both admin and regular staff)
 * @param {Object} req - Express request object with login credentials
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Find staff by username
    const staff = await Staff.findOne({
      where: { username },
      include: [{ model: Role }]
    });
    
    if (!staff) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if staff is active
    if (staff.status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, staff.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Determine role (Admin or Staff)
    const roleName = staff.Role.role_name === 'Admin' ? 'Admin' : 'Staff';
    
    // Create JWT payload
    const payload = {
      id: staff.staff_id,
      role: roleName,
      name: staff.name,
      username: staff.username
    };
    
    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Send response
    res.json({
      success: true,
      token,
      role: roleName,
      user: {
        id: staff.staff_id,
        name: staff.name,
        username: staff.username,
        email: staff.email
      }
    });
    
  } catch (err) {
    console.error('Staff Login Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

/**
 * Get Current Staff Profile
 * @param {Object} req - Express request object with user info from JWT token
 * @param {Object} res - Express response object
 */
exports.getCurrentStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.user.id, {
      include: [{ model: Role }],
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: staff.staff_id,
        name: staff.name,
        username: staff.username,
        email: staff.email,
        phone: staff.phone_no,
        role: staff.Role.role_name,
        status: staff.status
      }
    });
    
  } catch (err) {
    console.error('Get Staff Profile Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};
