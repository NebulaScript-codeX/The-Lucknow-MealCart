const Kitchen = require("../models/kitchenModel");

// Create Kitchen
async function createKitchen(req, res) {
  try {
    const {
      kitchenName,
      description,
      timings,
      deliveryAreas,
      minimumOrderAmount,
      estimatedDeliveryTime,
    } = req.body;

    // Only one kitchen per provider
    const existingKitchen = await Kitchen.findOne({
      ownerId: req.user._id,
    });

    if (existingKitchen) {
      return res.send({
        success: false,
        message: "Kitchen Already Exists.",
      });
    }

    const kitchen = await Kitchen.create({
      kitchenName,
      ownerId: req.user._id,
      description,
      timings,
      deliveryAreas,
      minimumOrderAmount,
      estimatedDeliveryTime,
    });

    return res.send({
      success: true,
      message: "Kitchen Created Successfully.",
      data: kitchen,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// Get My Kitchen
async function getMyKitchen(req, res) {
  try {
    const kitchen = await Kitchen.findOne({
      ownerId: req.user._id,
    });

    return res.send({
      success: true,
      data: kitchen,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
    });
  }
}

// Update Kitchen
async function updateKitchen(req, res) {
  try {
    const updatedKitchen = await Kitchen.findOneAndUpdate(
      {
        ownerId: req.user._id,
      },
      req.body,
      {
        new: true,
      },
    );

    return res.send({
      success: true,
      message: "Kitchen Updated Successfully.",
      data: updatedKitchen,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
    });
  }
}

// Delete Kitchen
async function deleteKitchen(req, res) {
  try {
    await Kitchen.findOneAndDelete({
      ownerId: req.user._id,
    });

    return res.send({
      success: true,
      message: "Kitchen Deleted Successfully.",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
    });
  }
}

// Get All Kitchens
async function getAllKitchens(req, res) {
  try {
    const kitchens = await Kitchen.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    return res.send({
      success: true,
      totalKitchens: kitchens.length,
      data: kitchens,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
      error: err.message,
    });
  }
}

// Get Single Kitchen
async function getKitchenById(req, res) {
  try {
    const kitchen = await Kitchen.findById(req.params.kitchenId).populate(
      "ownerId",
      "name email",
    );

    return res.send({
      success: true,
      data: kitchen,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Something Went Wrong.",
    });
  }
}

module.exports = {
  createKitchen,
  getMyKitchen,
  updateKitchen,
  deleteKitchen,
  getAllKitchens,
  getKitchenById,
};
