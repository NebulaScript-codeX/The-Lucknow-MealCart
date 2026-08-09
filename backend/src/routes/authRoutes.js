const express = require("express");

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
} = require("../controllers/authControllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// =========================================================
// AUTH
// =========================================================

router.post("/register", register);

router.post("/login", login);

// =========================================================
// CURRENT USER
// =========================================================

router.get("/me", authMiddleware, getMe);

// =========================================================
// PROFILE
// =========================================================

router.put("/update-profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

// =========================================================
// LOGOUT
// =========================================================

router.get("/logout", authMiddleware, logout);

module.exports = router;
