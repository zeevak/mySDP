// controllers/dashboardController.js
/**
 * Dashboard Controller
 * Handles fetching dashboard statistics and activity data
 */

const sequelize = require('../config/db');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const Inventory = require('../models/Inventory');
const Project = require('../models/Project');
const Message = require('../models/Message');
const Request = require('../models/Request');
const queries = require('../queries/dashboardQueries');

/**
 * Get Dashboard Statistics
 * Fetches counts of various entities for the admin dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStats = async (req, res) => {
  try {
    console.log('Fetching dashboard statistics...');

    // Initialize default values
    let customers = 0;
    let staff = 0;
    let projects = 0;
    let inventory = 0;
    let messages = 0;
    let requests = 0;

    try {
      // Get counts directly using QueryTypes.SELECT for better error handling
      const customerCount = await sequelize.query(queries.customerCount, { type: sequelize.QueryTypes.SELECT });
      customers = parseInt(customerCount[0]?.count) || 0;
      console.log('- Customers:', customers);

      const staffCount = await sequelize.query(queries.staffCount, { type: sequelize.QueryTypes.SELECT });
      staff = parseInt(staffCount[0]?.count) || 0;
      console.log('- Staff:', staff);

      const projectCount = await sequelize.query(queries.projectCount, { type: sequelize.QueryTypes.SELECT });
      projects = parseInt(projectCount[0]?.count) || 0;
      console.log('- Projects:', projects);

      const inventoryCount = await sequelize.query(queries.inventoryCount, { type: sequelize.QueryTypes.SELECT });
      inventory = parseInt(inventoryCount[0]?.count) || 0;
      console.log('- Inventory:', inventory);

      const messageCount = await sequelize.query(queries.unreadMessageCount, { type: sequelize.QueryTypes.SELECT });
      messages = parseInt(messageCount[0]?.count) || 0;
      console.log('- Messages:', messages);

      const requestCount = await sequelize.query(queries.pendingRequestCount, { type: sequelize.QueryTypes.SELECT });
      requests = parseInt(requestCount[0]?.count) || 0;
      console.log('- Requests:', requests);
    } catch (error) {
      console.error('Error querying counts:', error);
      // Continue with default values if there's an error
    }

    // Log the results for debugging
    console.log('Dashboard statistics fetched successfully');

    // Return the statistics
    return res.status(200).json({
      customers,
      staff,
      projects,
      inventory,
      messages,
      requests
    });
  } catch (err) {
    console.error('Error fetching dashboard statistics:', err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: err.message
    });
  }
};

/**
 * Get Recent Activity
 * Fetches recent activity data for the admin dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getActivity = async (req, res) => {
  try {
    console.log('Fetching recent activity...');

    // Initialize empty arrays for each activity type
    let recentCustomers = [];
    let recentProjects = [];
    let recentMessages = [];
    let recentRequests = [];

    try {
      // Get activity data directly using QueryTypes.SELECT for better error handling
      try {
        recentCustomers = await sequelize.query(queries.recentCustomers, { type: sequelize.QueryTypes.SELECT });
        console.log(`Found ${recentCustomers.length} recent customers`);
      } catch (err) {
        console.error('Error fetching recent customers:', err.message);
      }

      try {
        recentProjects = await sequelize.query(queries.recentProjects, { type: sequelize.QueryTypes.SELECT });
        console.log(`Found ${recentProjects.length} recent projects`);
      } catch (err) {
        console.error('Error fetching recent projects:', err.message);
      }

      try {
        recentMessages = await sequelize.query(queries.recentMessages, { type: sequelize.QueryTypes.SELECT });
        console.log(`Found ${recentMessages.length} recent messages`);
      } catch (err) {
        console.error('Error fetching recent messages:', err.message);
      }

      try {
        recentRequests = await sequelize.query(queries.recentRequests, { type: sequelize.QueryTypes.SELECT });
        console.log(`Found ${recentRequests.length} recent requests`);
      } catch (err) {
        console.error('Error fetching recent requests:', err.message);
      }
    } catch (error) {
      console.error('Error querying activity:', error);
      // Continue with empty arrays if there's an error
    }

    // Transform the data into a unified activity format
    const activities = [
      // Customer registrations
      ...(recentCustomers || []).map(customer => ({
        description: 'New customer registered',
        type: 'Customer',
        user: customer.full_name,
        role: 'Customer',
        timestamp: customer.registration_date
      })),

      // Project updates
      ...(recentProjects || []).map(project => ({
        description: `Project #${project.project_id} ${project.status}`,
        type: 'Project',
        user: project.staff_name || 'Unassigned',
        role: 'Staff',
        timestamp: project.start_date
      })),

      // New messages
      ...(recentMessages || []).map(message => ({
        description: `New message from ${message.f_name} ${message.l_name}`,
        type: 'Message',
        user: `${message.f_name} ${message.l_name}`,
        role: 'Visitor',
        timestamp: message.message_date
      })),

      // Customer requests
      ...(recentRequests || []).map(request => ({
        description: `New request: ${request.request_details?.substring(0, 30) || 'No details'}...`,
        type: 'Request',
        user: request.customer_name,
        role: 'Customer',
        timestamp: request.request_date
      }))
    ];

    // Sort by timestamp (newest first) and limit to 10 items
    const sortedActivities = activities
      .filter(activity => activity.timestamp) // Filter out activities with null timestamps
      .sort((a, b) => {
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
      .slice(0, 10);

    console.log(`Fetched ${sortedActivities.length} recent activities`);

    return res.status(200).json(sortedActivities);
  } catch (err) {
    console.error('Error fetching recent activity:', err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: err.message
    });
  }
};
