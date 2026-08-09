const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Details
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // User Role
    role: {
      type: String,
      enum: ["admin", "customer", "provider"],
      default: "customer",
    },

    // Contact Details
    contactNumber: {
      type: Number,
    },

    // Multiple Addresses
    addresses: {
      type: [String],
      default: [],
    },

    // Cart
    cart: [
      {
        mealId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "meals",
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    // Subscribed Kitchens
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "kitchens",
      },
    ],

    // Wishlist
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "meals",
      },
    ],
  },

  {
    timestamps: true,
  },
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
