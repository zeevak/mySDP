// staffController.js
/**
 * Staff Management Controller
 * Handles CRUD operations for staff members (admin only)
 */

const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');
const Role = require('../models/Role');

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
        role_name: staff.Role.role_name,
        status: staff.status
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
    const { name, email, phone_no, role_id, username, password, status } = req.body;
    
    try {
      // Check if username already exists
      const existingStaff = await Staff.findOne({ where: { username } });
      if (existingStaff) {
        return res.status(400).json({
          success: false,
          error: 'Username already exists'
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
        password_hash: hashedPassword,
        status: status || 'Active'
      });
      


      // Get role information
      const role = await Role.findByPk(role_id);
      
      res.status(201).json({
        success: true,
        data: {
          staff_id: newStaff.staff_id,
          name: newStaff.name,
          email: newStaff.email,
          phone_no: newStaff.phone_no,
          role_id: newStaff.role_id,
          role_name: role.role_name,
          username: newStaff.username,
          status: newStaff.status
        }
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
      password_hash: hashedPassword,
      status: 'Active'
    });

    res.status(201).json({ success: true, data: admin });
  } catch (err) {
    console.error('Error creating admin:', err);
    res.status(500).json({ success: false, error: 'Failed to create admin user' });
  }
},

  updateStaff: async (req, res) => {
    const { id } = req.params;
    const { name, email, phone_no, role_id, username, password, status } = req.body;
    
    try {
      // Check if staff exists
      const staff = await Staff.findByPk(id);
      if (!staff) {
        return res.status(404).json({
          success: false,
          error: 'Staff member not found'
        });
      }
      
      // Check if username is being changed and already exists
      if (username !== staff.username) {
        const existingStaff = await Staff.findOne({ where: { username } });
        if (existingStaff) {
          return res.status(400).json({
            success: false,
            error: 'Username already exists'
          });
        }
      }
      
      // Update fields
      staff.name = name;
      staff.email = email;
      staff.phone_no = phone_no;
      staff.role_id = role_id;
      staff.username = username;
      staff.status = status;
      
      // Update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        staff.password_hash = await bcrypt.hash(password, salt);
      }
      
      await staff.save();
      
      // Get updated role information
      const role = await Role.findByPk(role_id);
      
      res.status(200).json({
        success: true,
        data: {
          staff_id: staff.staff_id,
          name: staff.name,
          email: staff.email,
          phone_no: staff.phone_no,
          role_id: staff.role_id,
          role_name: role.role_name,
          username: staff.username,
          status: staff.status
        }
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
