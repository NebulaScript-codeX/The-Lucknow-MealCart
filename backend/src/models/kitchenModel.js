const mongoose = require("mongoose");

const kitchenSchema = new mongoose.Schema(
  {
    kitchenName: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    timings: {
      type: String,
      required: true,
    },

    deliveryAreas: {
      type: [String],
      required: true,
    },

    minimumOrderAmount: {
      type: Number,
      required: true,
    },

    estimatedDeliveryTime: {
      type: String,
      required: true,
    },

    openStatus: {
      type: Boolean,
      default: true,
    },

    // THIS IS REQUIRED
    totalMeals: {
      type: Number,
      default: 0,
    },

    totalSubscribers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Kitchen = mongoose.model("kitchens", kitchenSchema);

module.exports = Kitchen;
