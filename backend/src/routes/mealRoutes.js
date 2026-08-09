const express = require("express");

const {
  addMeal,
  getMyMeals,
  updateMeal,
  deleteMeal,
  getMealById,
  getMealsByKitchen,
  getAllMeals,
} = require("../controllers/mealControllers");

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/add-meal", authMiddleware, upload.single("image"), addMeal);

router.get("/my-meals", authMiddleware, getMyMeals);

router.put(
  "/update-meal/:mealId",
  authMiddleware,
  upload.single("image"),
  updateMeal,
);

router.delete("/delete-meal/:mealId", authMiddleware, deleteMeal);

router.get("/all", getAllMeals);

router.get("/:mealId", getMealById);

router.get("/kitchen/:kitchenId", getMealsByKitchen);

module.exports = router;
