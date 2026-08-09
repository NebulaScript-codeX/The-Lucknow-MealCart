const Order = require("../models/orderModel");
const Kitchen = require("../models/kitchenModel");
const Meal = require("../models/mealModel");
const Cart = require("../models/cartModel");
const Notification = require("../models/notificationModel");
// Create Order

async function createOrder(req, res) {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    // 1. Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.send({
        success: false,
        message: "Cart is empty.",
      });
    }

    // 2. Validate delivery address
    if (
      !deliveryAddress?.fullName?.trim() ||
      !deliveryAddress?.phone?.trim() ||
      !deliveryAddress?.addressLine?.trim() ||
      !deliveryAddress?.pincode?.trim()
    ) {
      return res.send({
        success: false,
        message: "Delivery address is incomplete.",
      });
    }

    // 3. Validate payment method
    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.send({
        success: false,
        message: "Invalid payment method.",
      });
    }

    // 4. Fetch meals from DB (never trust client price/title)
    const mealIds = items.map((i) => i.mealId);

    const meals = await Meal.find({ _id: { $in: mealIds } });

    if (meals.length !== mealIds.length) {
      return res.send({
        success: false,
        message: "One or more meals not found.",
      });
    }

    // 5. Ensure all meals belong to the same kitchen
    const kitchenIds = [...new Set(meals.map((m) => m.kitchenId.toString()))];

    if (kitchenIds.length > 1) {
      return res.send({
        success: false,
        message:
          "Cart has meals from multiple kitchens. Please order from one kitchen at a time.",
      });
    }

    const kitchenId = kitchenIds[0];

    const kitchen = await Kitchen.findById(kitchenId);

    if (!kitchen) {
      return res.send({
        success: false,
        message: "Kitchen Not Found.",
      });
    }

    // 6. Build final items using DB values (price & title verified)
    const finalItems = items.map((reqItem) => {
      const meal = meals.find((m) => m._id.toString() === reqItem.mealId);

      return {
        mealId: meal._id,
        title: meal.title,
        quantity: reqItem.quantity || 1,
        price: meal.price,
      };
    });

    // 7. Recalculate totals on backend (never trust client totals)
    const subtotal = finalItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const deliveryFee = 40;

    const tax = Number((subtotal * 0.05).toFixed(2));

    const totalAmount = subtotal + deliveryFee + tax;

    // 8. Create Order
    const order = await Order.create({
      customerId: req.user._id,
      providerId: kitchen.ownerId,
      kitchenId,
      items: finalItems,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    });
    // Notify Provider about new order
    await Notification.create({
      userId: kitchen.ownerId,
      title: "New Order Received 🛎️",
      message: `You have received a new order of ₹${totalAmount}. Please review and accept the order.`,
    });

    // 9. Clear the customer's cart after successful order
    await Cart.findOneAndDelete({
      customerId: req.user._id,
    });

    return res.send({
      success: true,
      message: "Order Placed Successfully.",
      data: order,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Get Customer Orders
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({
      customerId: req.user._id,
    })
      .populate("kitchenId", "kitchenName")
      .sort({ createdAt: -1 });

    return res.send({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Get Order By ID
async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    return res.send({
      success: true,
      data: order,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Get Provider Orders
async function getProviderOrders(req, res) {
  try {
    const orders = await Order.find({
      providerId: req.user._id,
    });

    return res.send({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Accept Order
async function acceptOrder(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.send({
        success: false,
        message: "Order Not Found.",
      });
    }

    order.orderStatus = "accepted";

    await order.save();

    await Notification.create({
      userId: order.customerId,
      title: "Order Accepted ✅",
      message: "Great news! The kitchen has accepted your order.",
    });

    return res.send({
      success: true,
      message: "Order Accepted Successfully.",
      data: order,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
// Reject Order
async function rejectOrder(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.send({
        success: false,
        message: "Order Not Found.",
      });
    }

    order.orderStatus = "cancelled";

    await order.save();

    // Notify customer
    await Notification.create({
      userId: order.customerId,
      title: "Order Cancelled ❌",
      message: "Unfortunately, the kitchen was unable to accept your order.",
    });

    return res.send({
      success: true,
      message: "Order Cancelled Successfully.",
      data: order,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Update Order Status
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const statuses = [
      "placed",
      "accepted",
      "preparing",
      "out-for-delivery",
      "delivered",
    ];

    const order = await Order.findById(orderId);

    if (!order) {
      return res.send({
        success: false,
        message: "Order Not Found.",
      });
    }

    const currentIndex = statuses.indexOf(order.orderStatus);
    const nextIndex = statuses.indexOf(orderStatus);

    if (nextIndex <= currentIndex) {
      return res.send({
        success: false,
        message: "Invalid Status Update.",
      });
    }

    // Update order
    order.orderStatus = orderStatus;

    // COD payment complete after delivery
    if (orderStatus === "delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }

    await order.save();

    // Notification content
    const notificationMessages = {
      accepted: {
        title: "Order Accepted ✅",
        message: "Your order has been accepted by the kitchen.",
      },

      preparing: {
        title: "Your Order Is Being Prepared 👨‍🍳",
        message: "The kitchen has started preparing your order.",
      },

      "out-for-delivery": {
        title: "Order Out For Delivery 🛵",
        message: "Your order is on the way and will reach you soon.",
      },

      delivered: {
        title: "Order Delivered 🎉",
        message: "Your order has been delivered successfully. Enjoy your meal!",
      },
    };

    const notification = notificationMessages[orderStatus];

    if (notification) {
      await Notification.create({
        userId: order.customerId,
        title: notification.title,
        message: notification.message,
      });
    }

    return res.send({
      success: true,
      message: "Order Status Updated Successfully.",
      data: order,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getProviderOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
};
