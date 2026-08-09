const Meal = require("../models/mealModel");
const Kitchen = require("../models/kitchenModel");

// Add Meal
async function addMeal(req, res) {
  try {
    const {
      title,
      description,
      category,
      mealType,
      vegOrNonVeg,
      price,
      quantityAvailable,
      isAvailable,
    } = req.body;

    const image = req.file?.path;

    const kitchen = await Kitchen.findOne({
      ownerId: req.user._id,
    });

    if (!kitchen) {
      return res.send({
        success: false,
        message: "Please Create A Kitchen First.",
      });
    }

    const meal = await Meal.create({
      title,
      description,
      image,
      category,
      mealType,
      vegOrNonVeg,
      price,
      quantityAvailable,
      isAvailable:
        isAvailable === undefined
          ? true
          : String(isAvailable).toLowerCase() === "true",
      kitchenId: kitchen._id,
    });

    await Kitchen.findByIdAndUpdate(
      kitchen._id,
      {
        $inc: {
          totalMeals: 1,
        },
      },
      { new: true },
    );

    return res.send({
      success: true,
      message: "Meal Added Successfully.",
      data: meal,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// Get My Meals
async function getMyMeals(req, res) {
  try {
    const kitchen = await Kitchen.findOne({
      ownerId: req.user._id,
    });

    if (!kitchen) {
      return res.send({
        success: true,
        data: [],
      });
    }

    const meals = await Meal.find({
      kitchenId: kitchen._id,
    }).sort({ createdAt: -1 });

    return res.send({
      success: true,
      data: meals,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// Update Meal
async function updateMeal(req, res) {
  try {
    const { mealId } = req.params;

    const updateData = {};

    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }

    if (req.body.category !== undefined) {
      updateData.category = req.body.category;
    }

    if (req.body.mealType !== undefined) {
      updateData.mealType = req.body.mealType;
    }

    if (req.body.vegOrNonVeg !== undefined) {
      updateData.vegOrNonVeg = req.body.vegOrNonVeg;
    }

    if (req.body.price !== undefined) {
      updateData.price = Number(req.body.price);
    }

    if (req.body.quantityAvailable !== undefined) {
      updateData.quantityAvailable = Number(req.body.quantityAvailable);
    }

    // IMPORTANT: availability
    if (req.body.isAvailable !== undefined) {
      updateData.isAvailable =
        String(req.body.isAvailable).toLowerCase() === "true";
    }

    // New image only if uploaded
    if (req.file?.path) {
      updateData.image = req.file.path;
    }

    const meal = await Meal.findByIdAndUpdate(mealId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!meal) {
      return res.send({
        success: false,
        message: "Meal Not Found.",
      });
    }

    return res.send({
      success: true,
      message: "Meal Updated Successfully.",
      data: meal,
    });
  } catch (err) {
    console.error("Update Meal Error:", err);

    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Delete Meal
async function deleteMeal(req, res) {
  try {
    const { mealId } = req.params;

    const meal = await Meal.findById(mealId);

    if (!meal) {
      return res.send({
        success: false,
        message: "Meal Not Found.",
      });
    }

    const kitchen = await Kitchen.findById(meal.kitchenId);

    if (kitchen) {
      await Kitchen.findByIdAndUpdate(kitchen._id, {
        $inc: {
          totalMeals: -1,
        },
      });
    }

    await Meal.findByIdAndDelete(mealId);

    return res.send({
      success: true,
      message: "Meal Deleted Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Get Meal By ID
async function getMealById(req, res) {
  try {
    const { mealId } = req.params;

    const meal = await Meal.findById(mealId);

    return res.send({
      success: true,
      data: meal,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

// Get All Meals
async function getAllMeals(req, res) {
  try {
    const meals = await Meal.find()
      .populate("kitchenId", "name image address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Meals fetched successfully.",
      totalMeals: meals.length,
      meals,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meals.",
      error: error.message,
    });
  }
}

// Get Meals Of A Kitchen
async function getMealsByKitchen(req, res) {
  try {
    const { kitchenId } = req.params;

    const meals = await Meal.find({
      kitchenId,
    });

    return res.send({
      success: true,
      data: meals,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  addMeal,
  getMyMeals,
  updateMeal,
  deleteMeal,
  getMealById,
  getMealsByKitchen,
  getAllMeals,
};
