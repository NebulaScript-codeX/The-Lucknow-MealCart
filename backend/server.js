const dotenv = require("dotenv");

// Load Environment Variables FIRST
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import DB Connection Function AFTER dotenv
const connectToDB = require("./src/config/connectToDB");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const kitchenRoutes = require("./src/routes/kitchenRoutes");
const mealRoutes = require("./src/routes/mealRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const planRoutes = require("./src/routes/planRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const favoriteRoutes = require("./src/routes/favoriteRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const homeRoutes = require("./src/routes/homeRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const providerRoutes = require("./src/routes/providerRoutes");
const customerDashboardRoutes = require("./src/routes/customerDashboardRoutes");

// Create Express App
const app = express();

// Connect Database
connectToDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.MODE === "development" ? true : process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Static Folder for Images
app.use("/uploads", express.static("uploads"));

// Health Check
app.get("/health", (req, res) => {
  res.send("Server Is Running Perfectly...");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/kitchen", kitchenRoutes);
app.use("/api/v1/meal", mealRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/plan", planRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/favorite", favoriteRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/home", homeRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/provider", providerRoutes);
app.use("/api/v1/customer", customerDashboardRoutes);

// Start Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server Started!");
  console.log(`Access At: http://localhost:${PORT}/health`);
});