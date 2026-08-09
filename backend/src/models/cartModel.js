const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    items: [
      {
        mealId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "meals",
        },

        quantity: {
          type: Number,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("carts", cartSchema);
