const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const Kitchen = require("../models/kitchenModel");
const Meal = require("../models/mealModel");
const Order = require("../models/orderModel");
const Subscription = require("../models/subscriptionModel");
const mongoose = require("mongoose");

// =====================================================
// GET PROVIDER DASHBOARD
// GET : /api/v1/provider/dashboard
// Access : Provider
// =====================================================

const getProviderDashboard = async (req, res) => {
  try {
    const providerId = req.user.id;

    // Provider Details
    const provider = await User.findById(providerId).select(
      "-password -wishlist -cart",
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    // Kitchen
    const kitchen = await Kitchen.findOne({
      ownerId: providerId,
    });

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found",
      });
    }

    // Meals
    const totalMeals = await Meal.countDocuments({
      kitchenId: kitchen._id,
    });

    // Orders
    const totalOrders = await Order.countDocuments({
      providerId,
    });

    const pendingOrders = await Order.countDocuments({
      providerId,
      orderStatus: "placed",
    });

    const acceptedOrders = await Order.countDocuments({
      providerId,
      orderStatus: "accepted",
    });

    const preparingOrders = await Order.countDocuments({
      providerId,
      orderStatus: "preparing",
    });

    const outForDeliveryOrders = await Order.countDocuments({
      providerId,
      orderStatus: "out-for-delivery",
    });

    const deliveredOrders = await Order.countDocuments({
      providerId,
      orderStatus: "delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      providerId,
      orderStatus: "cancelled",
    });

    // Subscribers
    const totalSubscribers = await Subscription.countDocuments({
      kitchenId: kitchen._id,
      status: "active",
    });

    // Earnings
    const earningResult = await Order.aggregate([
      {
        $match: {
          providerId: new mongoose.Types.ObjectId(req.user._id),
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalEarnings = earningResult.length > 0 ? earningResult[0].total : 0;

    // Recent Orders
    const recentOrders = await Order.find({
      providerId,
    })
      .populate("customerId", "name email")
      .populate("kitchenId", "kitchenName")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: "Provider Dashboard Loaded Successfully",

      data: {
        provider,

        kitchen,

        stats: {
          totalMeals,
          totalOrders,
          pendingOrders,
          acceptedOrders,
          preparingOrders,
          outForDeliveryOrders,
          deliveredOrders,
          cancelledOrders,
          totalSubscribers,
          totalEarnings,
        },

        recentOrders,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};

// =====================================================
// GET PROVIDER PROFILE
// GET : /api/v1/provider/profile
// Access : Provider
// =====================================================

const getProviderProfile = async (req, res) => {
  try {
    const providerId = req.user.id;

    const provider = await User.findById(providerId).select("-password");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    const kitchen = await Kitchen.findOne({
      ownerId: providerId,
    });

    return res.status(200).json({
      success: true,
      message: "Provider Profile Fetched Successfully",
      data: {
        provider,
        kitchen,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PROVIDER PROFILE
// PUT : /api/v1/provider/profile
// Access : Provider
// =====================================================

const updateProviderProfile = async (req, res) => {
  try {
    const providerId = req.user.id;

    const { name, contactNumber, addresses } = req.body;

    const provider = await User.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    if (name) {
      provider.name = name;
    }

    if (contactNumber) {
      provider.contactNumber = contactNumber;
    }

    if (addresses) {
      provider.addresses = addresses;
    }

    await provider.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: provider,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
// =====================================================
// CHANGE PROVIDER PASSWORD
// PUT : /api/v1/provider/change-password
// Access : Provider
// =====================================================

const changeProviderPassword = async (req, res) => {
  try {
    const providerId = req.user.id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old Password and New Password are required.",
      });
    }

    const provider = await User.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found.",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, provider.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old Password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    provider.password = hashedPassword;

    await provider.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
      error: error.message,
    });
  }
};

// =====================================================
// CHANGE PROVIDER EMAIL
// PUT : /api/v1/provider/change-email
// Access : Provider
// =====================================================

const changeProviderEmail = async (req, res) => {
  try {
    const providerId = req.user.id;

    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: "New Email is required.",
      });
    }

    const existingUser = await User.findOne({
      email: newEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const provider = await User.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found.",
      });
    }

    provider.email = newEmail;

    await provider.save();

    return res.status(200).json({
      success: true,
      message: "Email updated successfully.",
      data: provider,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update email.",
      error: error.message,
    });
  }
};

// =====================================================
// GET PROVIDER ANALYTICS
// GET : /api/v1/provider/analytics
// Access : Provider
// =====================================================

const getProviderAnalytics = async (req, res) => {
  try {
    const providerId = req.user.id;

    const kitchen = await Kitchen.findOne({
      ownerId: providerId,
    });

    if (!kitchen) {
      return res.status(404).json({
        success: false,
        message: "Kitchen not found.",
      });
    }

    // Monthly Orders
    const monthlyOrders = await Order.aggregate([
      {
        $match: {
          providerId: kitchen.ownerId,
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },
          totalOrders: {
            $sum: 1,
          },
          totalSales: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Top Meals
    const topMeals = await Meal.aggregate([
      {
        $match: {
          kitchenId: kitchen._id,
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "items.mealId",
          as: "orders",
        },
      },
      {
        $project: {
          title: 1,
          price: 1,
          totalOrders: {
            $size: "$orders",
          },
        },
      },
      {
        $sort: {
          totalOrders: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully.",
      data: {
        monthlyOrders,
        topMeals,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics.",
      error: error.message,
    });
  }
};
// =====================================================
// GET PROVIDER EARNINGS
// GET : /api/v1/provider/earnings
// Access : Provider
// =====================================================

const getProviderEarnings = async (req, res) => {
  try {
    const providerId = req.user.id;

    const paidOrders = await Order.find({
      providerId,
      paymentStatus: "paid",
    });

    let totalEarnings = 0;

    paidOrders.forEach((order) => {
      totalEarnings += order.totalAmount;
    });

    const totalOrders = paidOrders.length;

    const averageOrderValue =
      totalOrders === 0 ? 0 : Number((totalEarnings / totalOrders).toFixed(2));

    return res.status(200).json({
      success: true,
      message: "Earnings fetched successfully.",
      data: {
        totalOrders,
        totalEarnings,
        averageOrderValue,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch earnings.",
      error: error.message,
    });
  }
};

module.exports = {
  getProviderDashboard,
  getProviderProfile,
  updateProviderProfile,
  changeProviderPassword,
  changeProviderEmail,
  getProviderAnalytics,
  getProviderEarnings,
};
