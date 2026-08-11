const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC DETAILS
    // =====================================================
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [50, "Name cannot exceed 50 characters."],
      match: [
        /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
        "Name can contain only letters, spaces, apostrophes and hyphens.",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        "Please enter a valid email address.",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required."],
    },

    // =====================================================
    // USER ROLE
    // =====================================================
    role: {
      type: String,
      enum: ["admin", "customer", "provider"],
      default: "customer",
    },

    // =====================================================
    // CONTACT NUMBER
    // Stored as NUMBER in MongoDB
    // =====================================================
    contactNumber: {
      type: Number,
      min: [6000000000, "Please enter a valid 10-digit phone number."],
      max: [9999999999, "Please enter a valid 10-digit phone number."],
    },

    // =====================================================
    // MULTIPLE ADDRESSES
    // =====================================================
    addresses: {
      type: [String],
      default: [],

      validate: {
        validator: function (addresses) {
          return addresses.every(
            (address) =>
              typeof address === "string" &&
              address.trim().length >= 10 &&
              address.trim().length <= 200,
          );
        },

        message: "Each address must be between 10 and 200 characters.",
      },
    },

    // =====================================================
    // CART
    // =====================================================
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

    // =====================================================
    // SUBSCRIBED KITCHENS
    // =====================================================
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "kitchens",
      },
    ],

    // =====================================================
    // WISHLIST
    // =====================================================
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
