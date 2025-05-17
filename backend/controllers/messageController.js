const Message = require('../models/Message');
const { Op } = require('sequelize');
require('dotenv').config();

/**
 * Submit contact form
 * @route POST /api/message/submit
 * @access Public
 */
exports.submitContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, interest, message } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Please fill in all required fields"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email address"
      });
    }

    // Validate phone format if provided
    if (phone) {
      const phoneRegex = /^\+?[0-9]{10,12}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid phone number"
        });
      }
    }

    // Format interest value for readability
    const formattedInterest = interest ? interest.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified';

    // Store in database using the Message model
    const newMessage = await Message.create({
      f_name: firstName.trim(),
      l_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone_no: phone || null,
      interested_in: formattedInterest,
      message_text: message.trim(),
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Your message has been saved successfully.",
      messageId: newMessage.message_id
    });

  } catch (err) {
    console.error("Contact Form Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to save message. Please try again later."
    });
  }
};

// Admin functions for managing messages

/**
 * Get all messages with pagination and filtering
 * @route GET /api/message
 * @access Private (Admin, Manager)
 */
exports.getAllMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      isRead,
      startDate,
      endDate,
      search
    } = req.query;

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause for filtering
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (isRead !== undefined) {
      whereClause.is_read = isRead === 'true';
    }

    // Date range filtering
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.created_at = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.created_at = {
        [Op.lte]: new Date(endDate)
      };
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { f_name: { [Op.iLike]: `%${search}%` } },
        { l_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { message_text: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get total count for pagination
    const totalCount = await Message.count({ where: whereClause });

    // Get messages with pagination and filtering
    const messages = await Message.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      data: messages
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve messages"
    });
  }
};

/**
 * Get single message
 * @route GET /api/message/:id
 * @access Private (Admin, Manager, Staff)
 */
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found"
      });
    }

    // Mark message as read if not already
    if (!message.is_read) {
      message.is_read = true;
      message.updated_at = new Date();
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    console.error("Error fetching message:", err);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve message"
    });
  }
};

/**
 * Update message status
 * @route PATCH /api/message/:id/status
 * @access Private (Admin, Manager)
 */
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find the message
    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found"
      });
    }

    // Update the message status
    message.status = status;
    message.updated_at = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    console.error("Error updating message status:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update message status"
    });
  }
};

/**
 * Delete a message
 * @route DELETE /api/message/:id
 * @access Private (Admin)
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found"
      });
    }

    // Delete the message
    await message.destroy();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete message"
    });
  }
};
