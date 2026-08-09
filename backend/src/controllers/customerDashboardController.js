const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const Favorite = require("../models/favoriteModel");

// =====================================================
// CUSTOMER DASHBOARD
// GET /api/v1/customer/dashboard
// =====================================================

async function getCustomerDashboard(req, res) {
  try {
    const customerId = req.user._id;

    // =================================================
    // Fetch all dashboard data in parallel
    // =================================================

    const [user, orders, notifications, favorites] = await Promise.all([
      // Customer + subscribed kitchens
      User.findById(customerId)
        .select("name email contactNumber addresses subscriptions")
        .populate(
          "subscriptions",
          "kitchenName description gallery timings deliveryAreas minimumOrderAmount estimatedDeliveryTime openStatus totalMeals totalSubscribers",
        ),

      // Customer orders
      Order.find({
        customerId,
      })
        .populate("kitchenId", "kitchenName")
        .sort({ createdAt: -1 })
        .limit(5),

      // Customer notifications
      Notification.find({
        userId: customerId,
      })
        .sort({ createdAt: -1 })
        .limit(5),

      // Customer favorites
      Favorite.find({
        customerId,
      })
        .populate("mealId")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // =================================================
    // User validation
    // =================================================

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Customer Not Found.",
      });
    }

    // =================================================
    // Calculate dashboard statistics
    // =================================================

    const totalSubscriptions = Array.isArray(user.subscriptions)
      ? user.subscriptions.length
      : 0;

    const totalOrders = await Order.countDocuments({
      customerId,
    });

    const unreadNotifications = await Notification.countDocuments({
      userId: customerId,
      isRead: false,
    });

    const totalFavorites = await Favorite.countDocuments({
      customerId,
    });

    // =================================================
    // Response
    // =================================================

    return res.status(200).send({
      success: true,
      message: "Customer Dashboard Loaded Successfully.",

      data: {
        customer: {
          id: user._id,
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
          addresses: user.addresses,
        },

        stats: {
          totalSubscriptions,
          totalOrders,
          unreadNotifications,
          totalFavorites,
        },

        subscriptions: user.subscriptions || [],

        recentOrders: orders,

        notifications: notifications,

        favorites: favorites,
      },
    });
  } catch (err) {
    console.error("Customer Dashboard Error:", err);

    return res.status(500).send({
      success: false,
      message: "Unable To Load Customer Dashboard.",
      error: err.message,
    });
  }
}

module.exports = {
  getCustomerDashboard,
};
