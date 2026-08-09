const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function authMiddleware(req, res, next) {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Please Login To Continue.",
      });
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const userData = await User.findById(decoded.userId);

    if (!userData) {
      return res.status(404).send({
        success: false,
        message: "User Not Found.",
      });
    }

    // Attach user to request
    req.user = userData;

    // Move to next middleware
    next();
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Authentication Failed.",
      error: err.message,
    });
  }
}

// Export Middleware
module.exports = authMiddleware;
