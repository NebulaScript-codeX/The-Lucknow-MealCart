const Favorite = require("../models/favoriteModel");
const Meal = require("../models/mealModel");

//Add to favorite

async function addFavorite(req, res) {
  try {
    const { mealId } = req.body;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.send({
        success: false,
        message: "Meal Not Found.",
      });
    }

    const exists = await Favorite.findOne({
      customerId: req.user._id,
      mealId,
    });

    if (exists) {
      return res.send({
        success: false,
        message: "Meal Already Added To Favorites.",
      });
    }

    const favorite = await Favorite.create({
      customerId: req.user._id,
      mealId,
    });

    return res.send({
      success: true,
      message: "Meal Added To Favorites.",
      data: favorite,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Get my favorite

async function getMyFavorites(req, res) {
  try {
    const favorites = await Favorite.find({
      customerId: req.user._id,
    }).populate("mealId");

    return res.send({
      success: true,
      data: favorites,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
// Toggle Favorite

async function toggleFavorite(req, res) {
  try {
    const { mealId } = req.body;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.send({
        success: false,
        message: "Meal Not Found.",
      });
    }

    const existing = await Favorite.findOne({
      customerId: req.user._id,
      mealId,
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);

      return res.send({
        success: true,
        isFavorite: false,
        message: "Meal removed from favorites.",
      });
    }

    await Favorite.create({
      customerId: req.user._id,
      mealId,
    });

    return res.send({
      success: true,
      isFavorite: true,
      message: "Meal added to favorites.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}
// Check Favorite

async function checkFavorite(req, res) {
  try {
    const { mealId } = req.params;

    const favorite = await Favorite.findOne({
      customerId: req.user._id,
      mealId,
    });

    return res.send({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

//Remove favorite

async function removeFavorite(req, res) {
  try {
    const { favoriteId } = req.params;

    await Favorite.findByIdAndDelete(favoriteId);

    return res.send({
      success: true,
      message: "Favorite Removed Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  addFavorite,
  getMyFavorites,
  removeFavorite,
  toggleFavorite,
  checkFavorite,
};
