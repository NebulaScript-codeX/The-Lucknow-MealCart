const mongoose = require("mongoose");

// Get MongoDB URL from .env file
const DB_URL =
  process.env.MONGO_URI || "mongodb://localhost:27017/lucknow_meal_cart";

// Function to connect MongoDB
async function connectToDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB_URL);

    console.log("✅ Connected To Database Successfully!");
  } catch (err) {
    console.log("❌ Failed To Connect Database!");
    console.log(err.message);

    // Stop Server if DB connection fails
    process.exit(1);
  }
}

// Export Function
module.exports = connectToDB;
