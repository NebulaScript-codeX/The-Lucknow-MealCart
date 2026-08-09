const express = require("express");

const {
  createKitchen,
  getMyKitchen,
  updateKitchen,
  deleteKitchen,
  getKitchenById,
  getAllKitchens,
} = require("../controllers/kitchenControllers");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Provider Routes
router.post("/create", authMiddleware, createKitchen);

router.get("/my-kitchen", authMiddleware, getMyKitchen);

router.put("/update", authMiddleware, updateKitchen);

router.delete("/delete", authMiddleware, deleteKitchen);

// Customer Routes
router.get("/all", getAllKitchens);

router.get("/:kitchenId", getKitchenById);

module.exports = router;
