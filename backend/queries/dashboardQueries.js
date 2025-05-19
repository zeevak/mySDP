/**
 * Dashboard Queries
 * JavaScript module exporting SQL queries for the admin dashboard
 */

const dashboardQueries = {
  // Basic count queries
  customerCount: 'SELECT COUNT(*) as count FROM customer',
  staffCount: 'SELECT COUNT(*) as count FROM staff',
  projectCount: 'SELECT COUNT(*) as count FROM project',
  inventoryCount: 'SELECT COUNT(*) as count FROM inventory',
  unreadMessageCount: 'SELECT COUNT(*) as count FROM message WHERE is_read = false',
  pendingRequestCount: 'SELECT COUNT(*) as count FROM request WHERE status = \'pending\'',

  // Recent activity queries
  recentCustomers: `
    SELECT customer_id, full_name, email, created_at as registration_date
    FROM customer
    ORDER BY created_at DESC
    LIMIT 5
  `,

  recentProjects: `
    SELECT p.project_id, p.project_type, p.status, s.name as staff_name, p.start_date
    FROM project p
    LEFT JOIN staff s ON p.staff_id = s.staff_id
    ORDER BY p.start_date DESC
    LIMIT 5
  `,

  recentMessages: `
    SELECT message_id, f_name, l_name, email, interested_in, is_read, created_at as message_date
    FROM message
    ORDER BY created_at DESC
    LIMIT 5
  `,

  recentRequests: `
    SELECT r.request_id, c.full_name as customer_name, r.request_details, r.status, r.request_date
    FROM request r
    JOIN customer c ON r.customer_id = c.customer_id
    ORDER BY r.request_date DESC
    LIMIT 5
  `,

  // Distribution queries
  projectStatusDistribution: `
    SELECT status, COUNT(*) as count
    FROM project
    GROUP BY status
  `,

  inventoryTypeDistribution: `
    SELECT item_type, COUNT(*) as count, SUM(quantity) as total_quantity
    FROM inventory
    GROUP BY item_type
  `,

  customerProvinceDistribution: `
    SELECT province, COUNT(*) as count
    FROM customer
    GROUP BY province
    ORDER BY count DESC
  `,

  staffRoleDistribution: `
    SELECT r.role_name, COUNT(*) as count
    FROM staff s
    JOIN role r ON s.role_id = r.role_id
    GROUP BY r.role_name
  `
};

module.exports = dashboardQueries;
