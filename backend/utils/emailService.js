/**
 * Email Service
 * Utility for sending emails from the application
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send welcome email to new customer with their credentials
 * @param {Object} customer - Customer object with email and credentials
 * @returns {Promise} - Promise resolving to info about the sent email
 */
const sendWelcomeEmail = async (customer, password) => {
  try {
    console.log(`Sending welcome email to ${customer.email}...`);
    
    // Email content
    const mailOptions = {
      from: `"Susaru Agro" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: 'Welcome to Susaru Agro - Your Account Details',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2e7d32;">Welcome to Susaru Agro!</h1>
          </div>
          
          <p>Dear ${customer.title || ''} ${customer.full_name},</p>
          
          <p>Thank you for registering with Susaru Agro. We're excited to have you join our community of agricultural enthusiasts and investors.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2e7d32;">Your Account Details</h3>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          
          <p>You can now log in to your account using these credentials. We recommend changing your password after your first login for security purposes.</p>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin-bottom: 5px;"><strong>Susaru Agro</strong></p>
            <p style="margin-bottom: 5px; color: #666;">Phone: +94 72 717 7635</p>
            <p style="margin-bottom: 5px; color: #666;">Email: info@susaruagro.com</p>
          </div>
        </div>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${customer.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send notification email to staff about new customer registration
 * @param {Object} customer - Customer object with details
 * @returns {Promise} - Promise resolving to info about the sent email
 */
const sendStaffNotificationEmail = async (customer) => {
  try {
    console.log('Sending staff notification email...');
    
    // Email content
    const mailOptions = {
      from: `"Susaru Agro System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Customer Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2e7d32;">New Customer Registration</h2>
          </div>
          
          <p>A new customer has registered with Susaru Agro:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${customer.title || ''} ${customer.full_name}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Phone:</strong> ${customer.phone_no_1 || 'Not provided'}</p>
            <p><strong>NIC:</strong> ${customer.nic_number || 'Not provided'}</p>
            <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>Please review this information and follow up with the customer as needed.</p>
        </div>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Staff notification email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending staff notification email:', error);
    // Don't throw error here to prevent blocking the main process
    return null;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendStaffNotificationEmail
};
