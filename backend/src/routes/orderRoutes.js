const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getProviderOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
} = require("../controllers/orderControllers");

const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Customer
router.post("/create-order", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

// Provider
router.get("/provider-orders", authMiddleware, getProviderOrders);

router.put("/accept/:orderId", authMiddleware, acceptOrder);

router.put("/reject/:orderId", authMiddleware, rejectOrder);

router.put("/update-status/:orderId", authMiddleware, updateOrderStatus);

// KEEP THIS LAST
router.get("/:orderId", authMiddleware, getOrderById);
module.exports = router;
