// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service
 * Handles sending emails for various purposes in the application
 */

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

/**
 * Send a welcome email to a new staff member with their login credentials
 * @param {Object} staffData - Staff member data
 * @param {string} staffData.name - Staff member's name
 * @param {string} staffData.email - Staff member's email
 * @param {string} staffData.username - Staff member's username
 * @param {string} staffData.password - Staff member's password (plain text)
 * @param {string} staffData.role_name - Staff member's role name
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendStaffWelcomeEmail = async (staffData) => {
  try {
    const { name, email, username, password, role_name } = staffData;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Susaru Agro <your-email@gmail.com>',
      to: email,
      subject: 'Welcome to Susaru Agro - Your Account Details',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2e7d32;">Welcome to Susaru Agro</h1>
          </div>

          <p>Dear ${name},</p>

          <p>Welcome to the Susaru Agro team! Your account has been created successfully. You have been assigned the role of <strong>${role_name}</strong>.</p>

          <p>Here are your login credentials:</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>

          <p>Please login at <a href="http://localhost:3000/login">http://localhost:3000/login</a> and change your password as soon as possible for security reasons.</p>

          <p>If you have any questions or need assistance, please contact the administrator.</p>

          <p>Best regards,<br>Susaru Agro Team</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575; text-align: center;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Staff welcome email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending staff welcome email:', error);
    // Don't throw the error to prevent disrupting the main flow
    // Just log it and return null
    return null;
  }
};

/**
 * Send a password reset email to a staff member
 * @param {Object} staffData - Staff member data
 * @param {string} staffData.name - Staff member's name
 * @param {string} staffData.email - Staff member's email
 * @param {string} staffData.resetToken - Password reset token
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendPasswordResetEmail = async (staffData) => {
  try {
    const { name, email, resetToken } = staffData;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Susaru Agro <your-email@gmail.com>',
      to: email,
      subject: 'Susaru Agro - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2e7d32;">Password Reset Request</h1>
          </div>

          <p>Dear ${name},</p>

          <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>

          <p>To reset your password, click the button below:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/reset-password/${resetToken}" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>

          <p>This link will expire in 1 hour for security reasons.</p>

          <p>Best regards,<br>Susaru Agro Team</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575; text-align: center;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return null;
  }
};

/**
 * Send a credential update email to a staff member
 * @param {Object} staffData - Staff member data
 * @param {string} staffData.name - Staff member's name
 * @param {string} staffData.email - Staff member's email
 * @param {string} staffData.username - Staff member's username (if changed)
 * @param {string} staffData.password - Staff member's new password (if changed)
 * @param {boolean} staffData.usernameChanged - Whether the username was changed
 * @param {boolean} staffData.passwordChanged - Whether the password was changed
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendCredentialUpdateEmail = async (staffData) => {
  try {
    const { name, email, username, password, usernameChanged, passwordChanged } = staffData;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Susaru Agro <your-email@gmail.com>',
      to: email,
      subject: 'Susaru Agro - Your Account Credentials Have Been Updated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2e7d32;">Account Update</h1>
          </div>

          <p>Dear ${name},</p>

          <p>Your account credentials have been updated by an administrator.</p>

          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${usernameChanged ? `<p><strong>New Username:</strong> ${username}</p>` : ''}
            ${passwordChanged ? `<p><strong>New Password:</strong> ${password}</p>` : ''}
          </div>

          <p>Please login at <a href="http://localhost:3000/login">http://localhost:3000/login</a> with your updated credentials.</p>

          <p>If you did not request these changes or have any questions, please contact the administrator immediately.</p>

          <p>Best regards,<br>Susaru Agro Team</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #757575; text-align: center;">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Credential update email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending credential update email:', error);
    return null;
  }
};

module.exports = {
  sendStaffWelcomeEmail,
  sendPasswordResetEmail,
  sendCredentialUpdateEmail
};
