const express = require("express");

const router = express.Router();

// Controllers
const {
  getProviderDashboard,
  getProviderProfile,
  updateProviderProfile,
  changeProviderPassword,
  changeProviderEmail,
  getProviderAnalytics,
  getProviderEarnings,
} = require("../controllers/providerController");

// Middleware
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("provider"),
  getProviderDashboard,
);

// ===================================================
// Provider Profile
// ===================================================

router.get(
  "/profile",
  authMiddleware,
  authorizeRoles("provider"),
  getProviderProfile,
);

router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("provider"),
  updateProviderProfile,
);

// ===================================================
// Analytics
// ===================================================

router.get(
  "/analytics",
  authMiddleware,
  authorizeRoles("provider"),
  getProviderAnalytics,
);

// ===================================================
// Earnings
// ===================================================

router.get(
  "/earnings",
  authMiddleware,
  authorizeRoles("provider"),
  getProviderEarnings,
);

// ===================================================
// Change Password
// ===================================================

router.put(
  "/change-password",
  authMiddleware,
  authorizeRoles("provider"),
  changeProviderPassword,
);

// ===================================================
// Change Email
// ===================================================

router.put(
  "/change-email",
  authMiddleware,
  authorizeRoles("provider"),
  changeProviderEmail,
);

module.exports = router;
