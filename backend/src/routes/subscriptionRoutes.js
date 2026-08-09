const express = require("express");

const {
  subscribeKitchen,
  unsubscribeKitchen,
  getMySubscriptions,
} = require("../controllers/subscriptionControllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Subscribe Kitchen
router.post("/subscribe/:kitchenId", authMiddleware, subscribeKitchen);

// Unsubscribe Kitchen
router.delete("/unsubscribe/:kitchenId", authMiddleware, unsubscribeKitchen);

// Get My Subscriptions
router.get("/my-subscriptions", authMiddleware, getMySubscriptions);

module.exports = router;
