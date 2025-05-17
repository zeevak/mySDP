// middleware/auth.js
/**
 * Authentication Middleware
 * Handles JWT verification and role-based authorization
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = (req, res, next) => {
 
  const authHeader = req.header("Authorization");
  let token;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.header("x-auth-token");
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: "No token, authorization denied" 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      error: "Token is not valid" 
    });
  }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role to access resource
 * @param {Array|String} roles - Allowed roles for the route
 * @returns {Function} - Express middleware function
 */
const authorize = (roles = []) => {
  
  // Convert string to array if a single role is passed
  if (typeof roles === 'string') roles = [roles];
  
  return (req, res, next) => {
    try {
      // Check if user exists (authentication check)
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          error: "Unauthorized: Authentication required" 
        });
      }
      
      // Check if user has a role property
      const userRole = req.user.role;
      if (userRole === undefined) {
        console.error('Role missing from user object:', req.user);
        return res.status(500).json({ 
          success: false, 
          error: "Authorization configuration error" 
        });
      }
      
      // Check if user's role is in the allowed roles list
      if (!roles.includes(userRole)) {
        return res.status(403).json({ 
          success: false, 
          error: `Forbidden: ${userRole} role cannot access this resource`
        });
      }
      
      // User is authorized, proceed to the next middleware/controller
      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      return res.status(500).json({ 
        success: false, 
        error: "Server error during authorization" 
      });
    }
  };
};

// Add logging statements after function definitions
console.log('protect middleware:', protect);
console.log('authorize middleware:', authorize);

module.exports = { protect, authorize };
