const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    // Meal Name
    title: {
      type: String,
      required: true,
    },

    // Description
    description: {
      type: String,
      required: true,
    },

    // Meal Image
    image: {
      type: String,
      required: true,
    },

    // Category
    category: {
      type: String,
      required: true,
    },

    // Breakfast/Lunch/Dinner
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },

    // Veg/Non-Veg
    vegOrNonVeg: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },

    // Price
    price: {
      type: Number,
      required: true,
    },

    // Available Quantity
    quantityAvailable: {
      type: Number,
      required: true,
    },

    // Meal Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Kitchen Reference
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kitchens",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Meal = mongoose.model("meals", mealSchema);

module.exports = Meal;