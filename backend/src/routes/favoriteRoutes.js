const express = require("express");

const {
  addFavorite,
  getMyFavorites,
  removeFavorite,
  toggleFavorite,
  checkFavorite,
} = require("../controllers/favoriteControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addFavorite);

router.get("/my-favorites", authMiddleware, getMyFavorites);

router.delete("/remove/:favoriteId", authMiddleware, removeFavorite);

router.post("/toggle", authMiddleware, toggleFavorite);

router.get("/check/:mealId", authMiddleware, checkFavorite);

module.exports = router;
