// staffController.js
/**
 * Staff Management Controller
 * Handles CRUD operations for staff members (admin only)
 */

const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');
const Role = require('../models/Role');
const emailService = require('../services/emailService');

// Define exports at the beginning
const staffController = {
  getAllStaff: async (req, res) => {
    try {
      const staffMembers = await Staff.findAll({
        include: [{ model: Role }],
        attributes: { exclude: ['password_hash'] }
      });

      const formattedStaff = staffMembers.map(staff => ({
        staff_id: staff.staff_id,
        name: staff.name,
        username: staff.username,
        email: staff.email,
        phone_no: staff.phone_no,
        role_id: staff.role_id,
        role_name: staff.Role ? staff.Role.role_name : 'Unknown'
      }));

      res.status(200).json({
        success: true,
        data: formattedStaff
      });
    } catch (err) {
      console.error('Error fetching staff:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch staff members'
      });
    }
  },

  createStaff: async (req, res) => {
    console.log('Create staff request body:', req.body);
    const { name, email, phone_no, role_id, username, password } = req.body;

    console.log('Extracted phone_no:', phone_no);

    try {
      // Validate input
      if (!name || !email || !phone_no || !role_id || !username || !password) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      // Validate name (letters and spaces only)
      if (!/^[A-Za-z\s]+$/.test(name)) {
        return res.status(400).json({
          success: false,
          error: 'Name should only contain letters and spaces'
        });
      }

      // Validate username (letters, numbers, underscores only)
      if (!/^[A-Za-z0-9_]+$/.test(username)) {
        return res.status(400).json({
          success: false,
          error: 'Username should only contain letters, numbers, and underscores'
        });
      }

      // Validate phone number (must start with 0 followed by 9 digits)
      if (!/^0\d{9}$/.test(phone_no)) {
        return res.status(400).json({
          success: false,
          error: 'Phone number must start with 0 followed by 9 digits'
        });
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      // Check if username already exists
      const existingStaff = await Staff.findOne({ where: { username } });
      if (existingStaff) {
        return res.status(400).json({
          success: false,
          error: 'Username already exists'
        });
      }

      // Check if email already exists
      const existingEmail = await Staff.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }

      // Check if phone number already exists
      const existingPhone = await Staff.findOne({ where: { phone_no } });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new staff member
      const newStaff = await Staff.create({
        name,
        email,
        phone_no,
        role_id,
        username,
        password_hash: hashedPassword
      });

      // Get role information
      const role = await Role.findByPk(role_id);

      // Prepare staff data for response and email
      const staffData = {
        staff_id: newStaff.staff_id,
        name: newStaff.name,
        email: newStaff.email,
        phone_no: newStaff.phone_no,
        role_id: newStaff.role_id,
        role_name: role.role_name,
        username: newStaff.username,
        password: password // Plain text password for email only
      };

      // Send welcome email with login credentials
      try {
        await emailService.sendStaffWelcomeEmail(staffData);
        console.log(`Welcome email sent to ${email}`);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Continue even if email fails
      }

      // Remove password from response data
      delete staffData.password;

      // Use correct article based on role name
      const article = role.role_name.toLowerCase() === 'admin' ? 'an' : 'a';

      res.status(201).json({
        success: true,
        message: `Successfully added ${name} as ${article} ${role.role_name}. An email has been sent with login details.`,
        data: staffData
      });
    } catch (err) {
      console.error('Error creating staff:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to create staff member'
      });
    }
  },

createRole: async (req, res) => {
  try {
    const { role_name } = req.body;
    const role = await Role.create({ role_name });
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ success: false, error: 'Failed to create role' });
  }
},

createAdmin: async (req, res) => {
  try {
    const { name, username, email, phone_no, password } = req.body;
    const role = await Role.findOne({ where: { role_name: 'Admin' } });

    if (!role) {
      return res.status(400).json({ success: false, error: 'Admin role not found' });
    }

    const existing = await Staff.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Staff.create({
      name,
      username,
      email,
      phone_no,
      role_id: role.role_id,
      password_hash: hashedPassword
      // status is set to 'Active' by default in the model
    });

    res.status(201).json({ success: true, data: admin });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ success: false, error: 'Failed to create admin user' });
  }
},

  updateStaff: async (req, res) => {
    const { id } = req.params;
    console.log('Update staff request body:', req.body);
    const { name, email, phone_no, role_id, username, password } = req.body;

    console.log('Extracted phone_no for update:', phone_no);

    try {
      // Check if staff exists
      const staff = await Staff.findByPk(id);
      if (!staff) {
        return res.status(404).json({
          success: false,
          error: 'Staff member not found'
        });
      }

      // Validate name (letters and spaces only)
      if (name && !/^[A-Za-z\s]+$/.test(name)) {
        return res.status(400).json({
          success: false,
          error: 'Name should only contain letters and spaces'
        });
      }

      // Validate username (letters, numbers, underscores only)
      if (username && !/^[A-Za-z0-9_]+$/.test(username)) {
        return res.status(400).json({
          success: false,
          error: 'Username should only contain letters, numbers, and underscores'
        });
      }

      // Validate phone number (must start with 0 followed by 9 digits)
      if (phone_no && !/^0\d{9}$/.test(phone_no)) {
        return res.status(400).json({
          success: false,
          error: 'Phone number must start with 0 followed by 9 digits'
        });
      }

      // Validate email format
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }

      // Check if username is being changed and already exists
      if (username && username !== staff.username) {
        const existingStaff = await Staff.findOne({ where: { username } });
        if (existingStaff) {
          return res.status(400).json({
            success: false,
            error: 'Username already exists'
          });
        }
      }

      // Check if email is being changed and already exists
      if (email && email !== staff.email) {
        const existingEmail = await Staff.findOne({ where: { email } });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            error: 'Email already exists'
          });
        }
      }

      // Check if phone number is being changed and already exists
      if (phone_no && phone_no !== staff.phone_no) {
        const existingPhone = await Staff.findOne({ where: { phone_no } });
        if (existingPhone) {
          return res.status(400).json({
            success: false,
            error: 'Phone number already exists'
          });
        }
      }

      // Update fields
      staff.name = name || staff.name;
      staff.email = email || staff.email;
      staff.phone_no = phone_no || staff.phone_no;
      staff.role_id = role_id || staff.role_id;
      staff.username = username || staff.username;

      // Update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        staff.password_hash = await bcrypt.hash(password, salt);
      }

      await staff.save();

      // Get updated role information
      const role = await Role.findByPk(staff.role_id);

      // Prepare staff data for response
      const staffData = {
        staff_id: staff.staff_id,
        name: staff.name,
        email: staff.email,
        phone_no: staff.phone_no,
        role_id: staff.role_id,
        role_name: role.role_name,
        username: staff.username
      };

      // Check if username or password was updated
      const usernameChanged = username && username !== staff.username;
      const passwordChanged = !!password;

      // If username or password was updated, send email notification
      if (usernameChanged || passwordChanged) {
        try {
          await emailService.sendCredentialUpdateEmail({
            ...staffData,
            password: password || '', // Plain text password for email only
            usernameChanged,
            passwordChanged
          });
          console.log(`Credential update email sent to ${staff.email}`);
        } catch (emailError) {
          console.error('Error sending credential update email:', emailError);
          // Continue even if email fails
        }
      }

      res.status(200).json({
        success: true,
        message: `Successfully updated ${staff.name}'s information.`,
        data: staffData
      });
    } catch (err) {
      console.error('Error updating staff:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to update staff member'
      });
    }
  },

  deleteStaff: async (req, res) => {
    const { id } = req.params;

    try {
      const staff = await Staff.findByPk(id);
      if (!staff) {
        return res.status(404).json({
          success: false,
          error: 'Staff member not found'
        });
      }

      await staff.destroy();

      res.status(200).json({
        success: true,
        message: 'Staff member deleted successfully'
      });
    } catch (err) {
      console.error('Error deleting staff:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to delete staff member'
      });
    }
  }
};

// Add logging to verify exports
console.log('Staff Controller Exports:', Object.keys(staffController));

module.exports = staffController;
