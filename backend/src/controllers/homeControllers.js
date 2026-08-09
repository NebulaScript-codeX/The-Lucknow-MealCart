const User = require("../models/userModel");
const Kitchen = require("../models/kitchenModel");
const Meal = require("../models/mealModel");

const getHomeStats = async (req, res) => {
  try {
    const totalMealsDelivered = await Meal.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalKitchens = await Kitchen.countDocuments();

    const customerSatisfaction = 98;

    return res.status(200).json({
      success: true,
      stats: {
        totalMealsDelivered,
        totalCustomers,
        totalKitchens,
        customerSatisfaction,
      },
    });
  } catch (error) {
    console.error("Home Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeaturedMeals = async (req, res) => {
  try {
    const meals = await Meal.find()
      .populate("kitchenId", "kitchenName")
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      data: meals,
    });
  } catch (error) {
    console.error("Featured Meals Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchMeals = async (req, res) => {
  try {
    const { query = "", zone = "" } = req.query;

    const searchQuery = query.trim();

    if (!searchQuery) {
      return res.status(200).json({
        success: true,
        data: {
          meals: [],
          kitchens: [],
        },
      });
    }

    const kitchenFilter = {
      kitchenName: {
        $regex: searchQuery,
        $options: "i",
      },
    };

    if (zone && zone !== "All Lucknow") {
      kitchenFilter.deliveryAreas = zone;
    }

    const [meals, kitchens] = await Promise.all([
      Meal.find({
        title: {
          $regex: searchQuery,
          $options: "i",
        },
      }).populate("kitchenId", "kitchenName deliveryAreas"),

      Kitchen.find(kitchenFilter).select(
        "kitchenName deliveryAreas openStatus",
      ),
    ]);

    const filteredMeals =
      zone && zone !== "All Lucknow"
        ? meals.filter(
            (meal) =>
              meal.kitchenId && meal.kitchenId.deliveryAreas?.includes(zone),
          )
        : meals.filter((meal) => meal.kitchenId);

    return res.status(200).json({
      success: true,
      data: {
        meals: filteredMeals,
        kitchens,
      },
    });
  } catch (error) {
    console.error("Home Search Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      data: {
        meals: [],
        kitchens: [],
      },
    });
  }
};

module.exports = {
  getHomeStats,
  getFeaturedMeals,
  searchMeals,
};
