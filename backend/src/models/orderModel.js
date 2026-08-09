const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kitchens",
      required: true,
    },

    items: [
      {
        mealId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "meals",
          required: true,
        },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 40 },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    // Object banaya String se
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      landmark: { type: String, default: "" },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
