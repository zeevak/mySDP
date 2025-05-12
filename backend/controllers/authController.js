const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize"); // Ensure Op is imported
const Customer = require("../models/Customer");
const Staff = require("../models/Staff");
const Role = require("../models/Role");
const CustomerLand = require("../models/CustomerLand");
require("dotenv").config();

exports.register = async (req, res) => {
  const { full_name, email, password, nic_number } = req.body;
  try {
    let customer = await Customer.findOne({ where: { email } });
    if (customer)
      return res.status(400).json({
        success: false,
        error: "Customer already exists"
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    customer = await Customer.create({
      full_name,
      email,
      password_hash: hashedPassword,
      nic_number,
    });

    const payload = { id: customer.customer_id, role: "customer" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userData = {
      id: customer.customer_id,
      email: customer.email,
      name: customer.full_name,
    };

    res.json({
      success: true,
      message: "Registration successful",
      token,
      user: userData,
      expiresIn: 3600
    });

    console.log(`User ${customer.email} registered at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during registration"
    });
  }
};

exports.customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ where: { email } });
    if (!customer)
      return res.status(401).json({
        success: false,
        error: "Authentication failed - user not found"
      });

    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch)
      return res.status(401).json({
        success: false,
        error: "Authentication failed - invalid password"
      });

    const payload = { id: customer.customer_id, role: "customer" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const userData = {
      id: customer.customer_id,
      email: customer.email,
      name: customer.full_name,
    };

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
      expiresIn: 3600
    });

    console.log(`Customer ${customer.email} logged in at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("Customer Login Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during authentication"
    });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const staff = await Staff.findOne({
      where: { username },
      include: [{ model: Role }],
    });
    if (!staff)
      return res.status(401).json({
        success: false,
        error: "Authentication failed - user not found"
      });

    if (staff.Role.role_name !== "admin")
      return res.status(403).json({
        success: false,
        error: "Not authorized as admin"
      });

    const isMatch = await bcrypt.compare(password, staff.password_hash);
    if (!isMatch)
      return res.status(401).json({
        success: false,
        error: "Authentication failed - invalid password"
      });

    const payload = { id: staff.staff_id, role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const userData = {
      id: staff.staff_id,
      username: staff.username,
      name: staff.name,
    };

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: userData,
      expiresIn: 3600
    });

    console.log(`Admin ${staff.username} logged in at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during authentication"
    });
  }
};

exports.createRole = async (req, res) => {
  const { role_name } = req.body;
  try {
    if (!role_name) {
      return res.status(400).json({
        success: false,
        error: "Role name is required"
      });
    }

    const existingRole = await Role.findOne({ where: { role_name } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: "Role already exists"
      });
    }

    const role = await Role.create({ role_name });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: {
        role_id: role.role_id,
        role_name: role.role_name
      }
    });

    console.log(`Role ${role.role_name} created at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("Create Role Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during role creation"
    });
  }
};

exports.createAdmin = async (req, res) => {
  const { name, username, email, password, role_id } = req.body;
  try {
    if (!name || !username || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        error: "All fields (name, username, email, password, role_id) are required"
      });
    }

    const existingStaff = await Staff.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });
    if (existingStaff) {
      return res.status(400).json({
        success: false,
        error: "Username or email already exists"
      });
    }

    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: "Role not found"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = await Staff.create({
      name,
      username,
      email,
      password_hash: hashedPassword,
      role_id
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        staff_id: staff.staff_id,
        name: staff.name,
        username: staff.username,
        email: staff.email,
        role_id: staff.role_id
      }
    });

    console.log(`Admin ${staff.username} created at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("Create Admin Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during admin creation"
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // Get user ID and role from the JWT token (set by auth middleware)
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'customer') {
      // Fetch customer data
      const customer = await Customer.findByPk(userId, {
        include: [
          {
            model: CustomerLand,
            as: 'lands'
          }
        ],
        attributes: { exclude: ['password_hash'] } // Don't send password hash
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: "Customer not found"
        });
      }

      // Format the response data
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
        healthInfo: customer.health_info,
        lands: customer.lands || []
      };

      return res.json({
        success: true,
        data: userData
      });
    } else if (userRole === 'admin') {
      // Fetch staff data
      const staff = await Staff.findByPk(userId, {
        include: [{ model: Role }],
        attributes: { exclude: ['password_hash'] } // Don't send password hash
      });

      if (!staff) {
        return res.status(404).json({
          success: false,
          error: "Staff member not found"
        });
      }

      // Format the response data
      const userData = {
        id: staff.staff_id,
        name: staff.name,
        username: staff.username,
        email: staff.email,
        role: staff.Role ? staff.Role.role_name : null
      };

      return res.json({
        success: true,
        data: userData
      });
    } else {
      return res.status(403).json({
        success: false,
        error: "Invalid user role"
      });
    }
  } catch (err) {
    console.error("Get Current User Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching user data"
    });
  }
};
