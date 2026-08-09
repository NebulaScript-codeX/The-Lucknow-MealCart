const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kitchens",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },

    mealsPerDay: {
      type: Number,
      required: true,
    },

    totalMeals: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("plans", planSchema);
