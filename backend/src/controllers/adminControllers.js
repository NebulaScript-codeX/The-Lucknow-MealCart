const User = require("../models/userModel");
const Kitchen = require("../models/kitchenModel");
const Meal = require("../models/mealModel");
const Subscription = require("../models/subscriptionModel");
const Plan = require("../models/planModel");

async function getDashboard(req, res) {
  try {
    const [
      totalCustomers,
      totalProviders,
      totalKitchens,
      totalMeals,
      totalPlans,
      totalSubscriptions,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "provider" }),
      Kitchen.countDocuments(),
      Meal.countDocuments(),
      Plan.countDocuments(),
      Subscription.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalProviders,
        totalKitchens,
        totalMeals,
        totalPlans,
        totalSubscriptions,
      },
    });
  } catch (err) {
    console.error("Admin Dashboard Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllCustomers(req, res) {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllProviders(req, res) {
  try {
    const providers = await User.find({ role: "provider" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllKitchens(req, res) {
  try {
    const kitchens = await Kitchen.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: kitchens,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllMeals(req, res) {
  try {
    const meals = await Meal.find()
      .populate("kitchenId", "kitchenName name image address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: meals,
      totalMeals: meals.length,
    });
  } catch (err) {
    console.error("Admin Meals Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function getAllSubscriptions(req, res) {
  try {
    const subscriptions = await Subscription.find()
      .populate("planId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getDashboard,
  getAllCustomers,
  getAllProviders,
  getAllKitchens,
  getAllMeals,
  getAllSubscriptions,
};

