import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Auth/Login";

import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Favorites from "./pages/Favorites/Favorites";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import Order from "./pages/Order/Order";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import Subscriptions from "./pages/Subscriptions/Subscriptions";
import MySubscriptions from "./pages/Mysubscriptions/Mysubscriptions";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";
import ReviewsRatings from "./pages/ReviewsRatings/ReviewsRatings";

import KitchenList from "./pages/KitchenList/KitchenList";
import SingleKitchen from "./pages/SingleKitchen/SingleKitchen";

import Meal from "./pages/Meal/Meal";
import SingleMeal from "./components/SingleMeal/SingleMeal";

import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminCustomers from "./pages/Admin/AdminCustomers/AdminCustomers";
import AdminProviders from "./pages/Admin/AdminProviders/AdminProviders";
import AdminKitchens from "./pages/Admin/AdminKitchens/AdminKitchens";
import AdminPlans from "./pages/Admin/AdminPlans/AdminPlans";
import AdminMeals from "./pages/Admin/AdminMeals/AdminMeals";

import ProviderDashboard from "./pages/Provider/Dashboard/ProviderDashboard";
import ProviderProfile from "./pages/Provider/Profile/ProviderProfile";
import ProviderKitchen from "./pages/Provider/Kitchen/KitchenProfile";
import ProviderPlans from "./pages/Provider/Plans/ProviderPlans";
import ProviderMeals from "./pages/Provider/Meals/ProviderMeals";
import ProviderOrders from "./pages/Provider/Orders/ProviderOrders";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* ==================== PUBLIC / AUTH ROUTES ==================== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* ==================== CUSTOMER ROUTES ==================== */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/reviews" element={<ReviewsRatings />} />

          {/* ==================== KITCHEN ROUTES ==================== */}
          <Route path="/kitchen/all" element={<KitchenList />} />
          <Route path="/kitchen/:kitchenId" element={<SingleKitchen />} />

          {/* ==================== MEAL ROUTES ==================== */}
          <Route path="/meal/all" element={<Meal />} />
          <Route path="/meal/:mealId" element={<SingleMeal />} />

          {/* ==================== ADMIN ROUTES ==================== */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/providers" element={<AdminProviders />} />
          <Route path="/admin/kitchens" element={<AdminKitchens />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/meals" element={<AdminMeals />} />

          {/* ==================== PROVIDER ROUTES ==================== */}
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
          <Route path="/provider/plans" element={<ProviderPlans />} />
          <Route path="/provider/kitchen" element={<ProviderKitchen />} />
          <Route path="/provider/meals" element={<ProviderMeals />} />
          <Route path="/provider/orders" element={<ProviderOrders />} />
        </Routes>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 2500,
            style: {
              background: "rgba(255,255,255,.95)",
              backdropFilter: "blur(18px)",
              color: "#1a1a1a",
              borderRadius: "16px",
              border: "1px solid rgba(245,121,58,.18)",
              boxShadow: "0 18px 40px rgba(0,0,0,.12)",
              padding: "14px 16px",
              fontSize: "14px",
              fontWeight: "600",
            },
            success: {
              iconTheme: {
                primary: "#f5793a",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
