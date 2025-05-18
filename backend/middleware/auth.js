// middleware/auth.js
/**
 * Authentication Middleware
 * Handles JWT verification and role-based authorization
 */

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = asyncHandler(async (req, res, next) => {
  try {
    let token;
    
    // Check if token is in the authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer [token]"
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Or get token from cookie
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if it's a customer token
      if (decoded.role === 'customer') {
        // Find customer and attach to request
        const customer = await db.customer.findByPk(decoded.id);
        
        if (!customer) {
          return res.status(401).json({
            success: false,
            error: 'Customer not found'
          });
        }
        
        // Set customer in request object
        req.customer = customer;
        next();
      } else {
        return res.status(401).json({
          success: false,
          error: 'Not authorized as customer'
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token is not valid'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error in authentication'
    });
  }
});

console.log('protect middleware:', protect);

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

console.log('authorize middleware:', authorize);

module.exports = { protect, authorize };
