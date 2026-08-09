const express = require("express");

const {
  getDashboard,
  getAllCustomers,
  getAllProviders,
  getAllKitchens,
  getAllMeals,
  getAllSubscriptions,
} = require("../controllers/adminControllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);

router.get("/customers", authMiddleware, getAllCustomers);

router.get("/providers", authMiddleware, getAllProviders);

router.get("/kitchens", authMiddleware, getAllKitchens);

router.get("/meals", authMiddleware, getAllMeals);

router.get("/subscriptions", authMiddleware, getAllSubscriptions);

module.exports = router;
