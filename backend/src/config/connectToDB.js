const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const DB_URL =
  process.env.MONGO_URI || "mongodb://localhost:27017/lucknow_meal_cart";

async function connectToDB() {
  try {
    console.log("🔍 DB_URL starts with:", DB_URL.substring(0, 30));

    await mongoose.connect(DB_URL);

    console.log("✅ Connected To Database Successfully!");
    console.log("🔗 MongoDB Host:", mongoose.connection.host);
    console.log("📂 Connected Database:", mongoose.connection.name);
  } catch (err) {
    console.log("❌ Failed To Connect Database!");
    console.log(err.message);
    process.exit(1);
  }
}

module.exports = connectToDB;