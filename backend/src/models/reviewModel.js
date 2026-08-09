const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // The exact order this review belongs to
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },

    // The kitchen from which the order was placed
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kitchens",
      required: true,
    },

    // The exact meal being reviewed
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "meals",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("reviews", reviewSchema);