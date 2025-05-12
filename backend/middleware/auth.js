const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header("Authorization");
  let token;

  // Check if token is in Authorization header (Bearer token)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fallback to x-auth-token header
    token = req.header("x-auth-token");
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No token, authorization denied"
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user data to request
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({
      success: false,
      error: "Token is not valid"
    });
  }
};

module.exports = auth;