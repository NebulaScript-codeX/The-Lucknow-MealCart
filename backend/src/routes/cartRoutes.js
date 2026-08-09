const express = require("express");

const {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartControllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);

router.get("/my-cart", authMiddleware, getMyCart);

router.put("/update/:mealId", authMiddleware, updateCartItem);

router.delete("/remove/:mealId", authMiddleware, removeFromCart);

router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
