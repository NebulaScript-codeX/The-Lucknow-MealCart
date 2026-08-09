const express = require("express");

const {
  createPlan,
  getMyPlans,
  getAllPlans,
  updatePlan,
  deletePlan,
  subscribePlan,
  getMySubscriptions,
  cancelSubscription,
} = require("../controllers/planControllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Provider
router.post("/create", authMiddleware, createPlan);

router.get("/my-plans", authMiddleware, getMyPlans);

router.put("/update/:planId", authMiddleware, updatePlan);

router.delete("/delete/:planId", authMiddleware, deletePlan);

// Customer
router.post("/subscribe/:planId", authMiddleware, subscribePlan);

router.get("/my-subscriptions", authMiddleware, getMySubscriptions);

router.get("/all", getAllPlans);
router.delete("/cancel/:subscriptionId", authMiddleware, cancelSubscription);

module.exports = router;
