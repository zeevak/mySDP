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
    // Check for hardcoded admin credentials
    if (username === 'kavinu' && password === 'admin2001') {
      console.log('Hardcoded admin login successful');

      // Find or create Admin role
      let adminRole = await Role.findOne({
        where: { role_name: 'Admin' }
      });

      if (!adminRole) {
        adminRole = await Role.create({
          role_name: 'Admin',
          description: 'System Administrator'
        });
        console.log('Admin role created for hardcoded admin');
      }

      // Generate JWT token for the hardcoded admin
      const payload = {
        id: 0, // Special ID for hardcoded admin
        username: 'kavinu',
        role: 'Admin'
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h' // Longer expiration for admin
      });

      return res.json({
        success: true,
        token,
        role: 'Admin',
        user: {
          staff_id: 0,
          name: 'System Administrator',
          username: 'kavinu',
          email: 'admin@susaruagro.com',
          role: 'Admin'
        }
      });
    }

    // Regular authentication flow for other users
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

    console.log('Found user:', username);
    console.log('Password from request:', password);
    console.log('Stored hash:', staff.password_hash);
    console.log('Hash length:', staff.password_hash.length);

    // Check if hash has proper format (should start with $2a$ or $2b$)
    if (!staff.password_hash.startsWith('$2')) {
      console.log('WARNING: Hash does not appear to be a valid bcrypt hash');
    }

    // Try different approaches to compare
    let isMatch = false;

    try {
      // Standard approach
      isMatch = await bcrypt.compare(password, staff.password_hash);
      console.log('Standard compare result:', isMatch);

      if (!isMatch) {
        // Try with explicit string conversion
        isMatch = await bcrypt.compare(String(password), String(staff.password_hash));
        console.log('String conversion compare result:', isMatch);
      }
    } catch (bcryptError) {
      console.error('Bcrypt comparison error:', bcryptError);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token for authenticated staff
    const payload = {
      id: staff.staff_id,
      username: staff.username,
      role: staff.Role.role_name
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    // Return success response with token and user data
    return res.json({
      success: true,
      token,
      role: staff.Role.role_name,
      user: {
        staff_id: staff.staff_id,
        name: staff.name,
        username: staff.username,
        email: staff.email,
        role: staff.Role.role_name
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
    // Check if this is the hardcoded admin (id = 0)
    if (req.user && req.user.id === 0 && req.user.username === 'kavinu') {
      return res.json({
        success: true,
        data: {
          id: 0,
          name: 'System Administrator',
          username: 'kavinu',
          email: 'admin@susaruagro.com',
          phone: '',
          role: 'Admin'
        }
      });
    }

    // For regular staff members
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
        role: staff.Role.role_name
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


/**
 * Create Initial Admin
 * Creates the first admin user if no admin exists
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createInitialAdmin = async (req, res) => {
  try {
    // Check if admin role exists
    let adminRole = await Role.findOne({
      where: { role_name: 'Admin' }
    });

    // Create admin role if it doesn't exist
    if (!adminRole) {
      adminRole = await Role.create({
        role_name: 'Admin',
        description: 'System Administrator'
      });
      console.log('Admin role created:', adminRole);
    }

    // Debug check - make sure adminRole exists
    if (!adminRole) {
      console.error('Failed to create or find admin role');
      return res.status(500).json({
        success: false,
        message: 'Failed to create or find admin role'
      });
    }

    // Check if any admin user exists
    const existingAdmin = await Staff.findOne({
      include: [{
        model: Role,
        where: { role_name: 'Admin' }
      }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    // Get admin details from request or use defaults
    const {
      name = 'System Admin',
      username = 'admin',
      password = 'admin123',
      email = 'admin@example.com',
      phone_no = ''
    } = req.body || {}; // Add a fallback empty object

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = await Staff.create({
      name,
      username,
      password_hash: hashedPassword,
      email,
      phone_no,
      role_id: adminRole.role_id
    });

    res.status(201).json({
      success: true,
      message: 'Initial admin user created successfully',
      data: {
        id: admin.staff_id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: 'Admin'
      }
    });

    console.log(`Initial admin user created: ${username}`);
  } catch (err) {
    console.error('Create Initial Admin Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while creating initial admin',
      error: err.message
    });
  }
};

