const express = require("express");

const {
  getHomeStats,
  getFeaturedMeals,
  searchMeals,
} = require("../controllers/homeControllers");

const router = express.Router();

router.get("/stats", getHomeStats);

router.get("/featured-meals", getFeaturedMeals);

router.get("/search", searchMeals);

module.exports = router;