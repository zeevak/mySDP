-- Dashboard Queries
-- This file contains all SQL queries used for the admin dashboard

-- Get total number of customers
SELECT COUNT(*) as count FROM customer;

-- Get total number of staff
SELECT COUNT(*) as count FROM staff;

-- Get total number of projects
SELECT COUNT(*) as count FROM project;

-- Get total number of inventory items
SELECT COUNT(*) as count FROM inventory;

-- Get count of unread messages
SELECT COUNT(*) as count FROM message WHERE is_read = false;

-- Get count of pending requests
SELECT COUNT(*) as count FROM request WHERE status = 'pending';

-- Get recent customer registrations
SELECT customer_id, full_name, email, created_at as registration_date
FROM customer
ORDER BY created_at DESC
LIMIT 5;

-- Get recent project updates
SELECT p.project_id, p.project_type, p.status, s.name as staff_name, p.start_date
FROM project p
LEFT JOIN staff s ON p.staff_id = s.staff_id
ORDER BY p.start_date DESC
LIMIT 5;

-- Get recent messages
SELECT message_id, f_name, l_name, email, interested_in, is_read, created_at as message_date
FROM message
ORDER BY created_at DESC
LIMIT 5;

-- Get recent requests
SELECT r.request_id, c.full_name as customer_name, r.request_details, r.status, r.request_date
FROM request r
JOIN customer c ON r.customer_id = c.customer_id
ORDER BY r.request_date DESC
LIMIT 5;

-- Get project status distribution
SELECT status, COUNT(*) as count
FROM project
GROUP BY status;

-- Get inventory by type
SELECT item_type, COUNT(*) as count, SUM(quantity) as total_quantity
FROM inventory
GROUP BY item_type;

-- Get customer distribution by province
SELECT province, COUNT(*) as count
FROM customer
GROUP BY province
ORDER BY count DESC;

-- Get staff distribution by role
SELECT r.role_name, COUNT(*) as count
FROM staff s
JOIN role r ON s.role_id = r.role_id
GROUP BY r.role_name;
