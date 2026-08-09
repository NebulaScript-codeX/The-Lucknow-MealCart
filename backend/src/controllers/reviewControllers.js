const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");

// =========================================
// Add Review
// =========================================

async function addReview(req, res) {
  try {
    const { orderId, kitchenId, mealId, rating, comment } = req.body;

    // Basic validation
    if (!orderId || !kitchenId || !mealId) {
      return res.send({
        success: false,
        message: "Order, kitchen and meal are required.",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.send({
        success: false,
        message: "Please provide a rating between 1 and 5.",
      });
    }

    if (!comment || !comment.trim()) {
      return res.send({
        success: false,
        message: "Please write a review.",
      });
    }

    // =========================================
    // Find customer's order
    // =========================================

    const order = await Order.findOne({
      _id: orderId,
      customerId: req.user._id,
    });

    if (!order) {
      return res.send({
        success: false,
        message: "Order not found.",
      });
    }

    // =========================================
    // Only delivered orders can be reviewed
    // =========================================

    if (order.orderStatus !== "delivered") {
      return res.send({
        success: false,
        message: "You can review only after the order is delivered.",
      });
    }

    // =========================================
    // Verify kitchen belongs to this order
    // =========================================

    if (order.kitchenId.toString() !== kitchenId.toString()) {
      return res.send({
        success: false,
        message: "Selected kitchen does not belong to this order.",
      });
    }

    // =========================================
    // Verify meal belongs to this order
    // =========================================

    const orderedMeal = order.items.find(
      (item) => item.mealId.toString() === mealId.toString(),
    );

    if (!orderedMeal) {
      return res.send({
        success: false,
        message: "Selected meal was not part of this order.",
      });
    }

    // =========================================
    // Check if this exact meal/order is already reviewed
    // =========================================

    const existingReview = await Review.findOne({
      customerId: req.user._id,
      orderId,
      mealId,
    });

    if (existingReview) {
      return res.send({
        success: false,
        message: "You have already reviewed this meal for this order.",
      });
    }

    // =========================================
    // Create Review
    // =========================================

    const review = await Review.create({
      customerId: req.user._id,
      orderId,
      kitchenId,
      mealId,
      rating,
      comment: comment.trim(),
    });

    return res.send({
      success: true,
      message: "Review Added Successfully.",
      data: review,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// =========================================
// My Reviews
// =========================================

async function getMyReviews(req, res) {
  try {
    const reviews = await Review.find({
      customerId: req.user._id,
    })
      .populate("kitchenId", "kitchenName")
      .populate("mealId", "title image")
      .populate("orderId", "createdAt orderStatus")
      .sort({ createdAt: -1 });

    return res.send({
      success: true,
      data: reviews,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// =========================================
// Kitchen Reviews
// =========================================

async function getKitchenReviews(req, res) {
  try {
    const { kitchenId } = req.params;

    const reviews = await Review.find({
      kitchenId,
    })
      .populate("customerId", "name profileImage")
      .populate("kitchenId", "kitchenName")
      .populate("mealId", "title image")
      .sort({ createdAt: -1 });

    return res.send({
      success: true,
      data: reviews,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// =========================================
// Home Testimonials
// =========================================

async function getHomeTestimonials(req, res) {
  try {
    const reviews = await Review.find({})
      .populate("customerId", "name profileImage")
      .populate("kitchenId", "kitchenName")
      .populate("mealId", "title image")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.send({
      success: true,
      data: reviews,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// =========================================
// Delete Review
// =========================================

async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      customerId: req.user._id,
    });

    if (!review) {
      return res.send({
        success: false,
        message: "Review not found.",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.send({
      success: true,
      message: "Review Deleted Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  addReview,
  getKitchenReviews,
  getHomeTestimonials,
  deleteReview,
  getMyReviews,
};
