const express = require("express");

const {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationControllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createNotification);

router.get("/my-notifications", authMiddleware, getMyNotifications);

router.put("/read/:notificationId", authMiddleware, markAsRead);

router.delete("/delete/:notificationId", authMiddleware, deleteNotification);

module.exports = router;
