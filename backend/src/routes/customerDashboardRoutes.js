const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getCustomerDashboard,
} = require("../controllers/customerDashboardController");

// =====================================================
// Customer Dashboard
// GET /api/v1/customer/dashboard
// =====================================================

router.get("/dashboard", authMiddleware, getCustomerDashboard);

module.exports = router;
