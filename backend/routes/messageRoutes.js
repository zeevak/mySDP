const express = require('express');
const router = express.Router();
const { 
  submitContactForm, 
  getAllMessages, 
  getMessageById, 
  updateMessageStatus, 
  deleteMessage 
} = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');

// Public route for contact form submission (NO protect/authorize)
router.post('/submit', submitContactForm);

// Protected routes for staff/admin (only these require auth)
router.get('/', protect, authorize(['Admin', 'Manager']), getAllMessages);
router.get('/:id', protect, authorize(['Admin', 'Manager', 'Staff']), getMessageById);
router.patch('/:id/status', protect, authorize(['Admin', 'Manager']), updateMessageStatus);
router.delete('/:id', protect, authorize(['Admin']), deleteMessage);

module.exports = router;
