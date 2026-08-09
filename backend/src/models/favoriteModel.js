const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "meals",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("favorites", favoriteSchema);
