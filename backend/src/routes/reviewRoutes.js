const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  addReview,
  getKitchenReviews,
  getHomeTestimonials,
  deleteReview,
  getMyReviews,
} = require("../controllers/reviewControllers");

// Add Review
router.post("/add", authMiddleware, addReview);

// My Reviews
router.get("/my-reviews", authMiddleware, getMyReviews);

// Kitchen Reviews
router.get("/kitchen/:kitchenId", getKitchenReviews);

// Delete Review
router.delete("/delete/:reviewId", authMiddleware, deleteReview);

// Home Testimonials
router.get("/home-testimonials", getHomeTestimonials);

module.exports = router;
