// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
require("dotenv").config();

exports.register = async (req, res) => {
  const { full_name, email, password, nic_number } = req.body; // <-- use 'password'
  try {
    let customer = await Customer.findOne({ where: { email } });
    if (customer)
      return res.status(400).json({ msg: "Customer already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // <-- hash the plain password

    customer = await Customer.create({
      full_name,
      email,
      password_hash: hashedPassword,
      nic_number,
    });

    const payload = { id: customer.customer_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.login = async (req, res) => {
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

    const payload = { id: customer.customer_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Secure user data to return
    const userData = {
      id: customer.customer_id,
      email: customer.email,
      name: customer.full_name,
      // Add other non-sensitive fields as needed
    };

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
      expiresIn: 3600 // 1 hour in seconds
    });

    console.log(`User ${customer.email} logged in at ${new Date().toISOString()}`);

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during authentication"
    });
  }
};

