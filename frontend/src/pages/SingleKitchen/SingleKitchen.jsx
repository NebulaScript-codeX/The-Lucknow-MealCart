import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import MealCard from "../../components/MealCard/MealCard";

import "./SingleKitchen.css";

// =====================================================
// BACKEND BASE URL
// =====================================================

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:4000";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image) return "";

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  // Normalize Windows paths
  const normalized = image.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${BACKEND_URL.replace(/\/+$/, "")}/${normalized}`;
};

// =====================================================
// PLAN KITCHEN ID HELPER
// =====================================================

const getPlanKitchenId = (plan) => {
  if (!plan?.kitchenId) return "";

  if (typeof plan.kitchenId === "object") {
    return (
      plan.kitchenId?._id ||
      plan.kitchenId?.id ||
      plan.kitchenId?.toString?.() ||
      ""
    ).toString();
  }

  return plan.kitchenId.toString();
};

// =====================================================
// PLAN CARD
// =====================================================

function PlanCard({ plan, onSubscribe, subscribing }) {
  const planName = plan?.name || plan?.title || "Subscription Plan";

  const duration =
    plan?.duration || (plan?.days ? `${plan.days} Days` : "Flexible Duration");

  const price = Number(plan?.price || 0);

  const description =
    plan?.description ||
    "Enjoy delicious homemade meals with this subscription plan.";

  const isSubscribing = subscribing === plan?._id;

  return (
    <motion.div
      className="plan-card"
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <div className="plan-card-top">
        <div>
          <span className="plan-label">SUBSCRIPTION</span>

          <h3>{planName}</h3>
        </div>

        <span className="plan-duration">{duration}</span>
      </div>

      <p className="plan-desc">{description}</p>

      <div className="plan-card-footer">
        <div className="plan-price-wrapper">
          <span className="plan-price">₹{price.toLocaleString("en-IN")}</span>
        </div>

        <button
          type="button"
          className="plan-subscribe-btn"
          disabled={isSubscribing}
          onClick={() => onSubscribe(plan?._id)}
        >
          {isSubscribing ? "Subscribing..." : "Subscribe Now"}
        </button>
      </div>
    </motion.div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function SingleKitchen() {
  const { kitchenId } = useParams();
  const navigate = useNavigate();

  const [kitchen, setKitchen] = useState(null);
  const [meals, setMeals] = useState([]);
  const [plans, setPlans] = useState([]);

  const [activeTab, setActiveTab] = useState("menu");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [subscribing, setSubscribing] = useState(null);

  // =====================================================
  // FETCH KITCHEN + MEALS + PLANS
  // =====================================================

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        // ---------------------------------------------
        // FETCH KITCHEN + MEALS
        // ---------------------------------------------

        const [kitchenRes, mealsRes] = await Promise.all([
          axiosInstance.get(`/kitchen/${kitchenId}`),
          axiosInstance.get(`/meal/kitchen/${kitchenId}`),
        ]);

        const kitchenData =
          kitchenRes.data?.data || kitchenRes.data?.kitchen || kitchenRes.data;

        const mealsData =
          mealsRes.data?.data || mealsRes.data?.meals || mealsRes.data || [];

        setKitchen(kitchenData);

        setMeals(Array.isArray(mealsData) ? mealsData.filter(Boolean) : []);

        // ---------------------------------------------
        // FETCH ALL PLANS
        // ---------------------------------------------

        try {
          const plansRes = await axiosInstance.get("/plan/all");

          const allPlans =
            plansRes.data?.data ||
            plansRes.data?.plans ||
            plansRes.data?.allPlans ||
            [];

          const plansArray = Array.isArray(allPlans)
            ? allPlans.filter(Boolean)
            : [];

          const currentKitchenId = kitchenId?.toString();

          const kitchenPlans = plansArray.filter((plan) => {
            const planKitchenId = getPlanKitchenId(plan);

            return planKitchenId === currentKitchenId;
          });

          setPlans(kitchenPlans);

          console.log("Kitchen ID:", currentKitchenId);

          console.log("Kitchen Plans:", kitchenPlans);
        } catch (planError) {
          console.error("Fetch subscription plans error:", planError);

          setPlans([]);
        }
      } catch (err) {
        console.error("Single kitchen error:", err);

        setError(err.response?.data?.message || "Unable to load this kitchen.");
      } finally {
        setLoading(false);
      }
    };

    if (kitchenId) {
      fetchAll();
    }
  }, [kitchenId]);

  // =====================================================
  // SUBSCRIBE
  // =====================================================

  const handleSubscribe = async (planId) => {
    if (!planId) {
      toast.error("Invalid subscription plan.");
      return;
    }

    try {
      setSubscribing(planId);

      const res = await axiosInstance.post(`/plan/subscribe/${planId}`);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Subscription failed.");
      }

      toast.success(res.data?.message || "Subscription successful!");
    } catch (err) {
      console.error("Subscription error:", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Subscription failed. Please try again.",
      );
    } finally {
      setSubscribing(null);
    }
  };

  // =====================================================
  // KITCHEN DATA
  // =====================================================

  const kitchenName =
    kitchen?.name || kitchen?.title || kitchen?.kitchenName || "Kitchen";

  const bannerImage = kitchen?.image
    ? getImageUrl(kitchen.image)
    : "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200&q=80";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="single-kitchen-loading">
          <div className="single-kitchen-loader" />

          <p>Loading kitchen...</p>
        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !kitchen) {
    return (
      <>
        <Navbar />

        <div className="single-kitchen-error">
          <div className="single-kitchen-error-icon">!</div>

          <h2>Kitchen unavailable</h2>

          <p>{error || "Kitchen not found."}</p>

          <button type="button" onClick={() => navigate("/kitchen/all")}>
            ← Back to Kitchens
          </button>
        </div>

        <Footer />
      </>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Navbar />

      {/* =================================================
          KITCHEN BANNER
      ================================================= */}

      <section className="kitchen-banner">
        <img
          src={bannerImage}
          alt={kitchenName}
          className="kitchen-banner-img"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200&q=80";
          }}
        />

        <div className="kitchen-banner-overlay" />

        <motion.div
          className="kitchen-banner-content"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <span className="kitchen-banner-label">FRESH • HOMEMADE • LOCAL</span>

          <h1>{kitchenName}</h1>

          <p>{kitchen.cuisine || "Fresh Homemade Meals • Multi-Cuisine"}</p>

          <div className="kitchen-banner-meta">
            {kitchen.rating && (
              <span className="kb-rating">
                ★ {Number(kitchen.rating).toFixed(1)}
              </span>
            )}

            <span>{kitchen.deliveryTime || "30-40 mins"}</span>

            <span className="dot">•</span>

            <span>{kitchen.location || kitchen.area || "Lucknow"}</span>
          </div>
        </motion.div>
      </section>

      {/* =================================================
          TABS
      ================================================= */}

      <div className="kitchen-tabs">
        <button
          type="button"
          className={`kitchen-tab ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          Menu
        </button>

        <button
          type="button"
          className={`kitchen-tab ${activeTab === "plans" ? "active" : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          Subscription Plans
        </button>

        <span
          className="kitchen-tab-indicator"
          style={{
            transform:
              activeTab === "menu" ? "translateX(0%)" : "translateX(100%)",
          }}
        />
      </div>

      {/* =================================================
          MENU
      ================================================= */}

      {activeTab === "menu" && (
        <motion.section
          className="kitchen-content"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {meals.length === 0 ? (
            <div className="kitchen-empty-text">
              <h3>No meals available</h3>

              <p>No meals have been added to this kitchen yet.</p>
            </div>
          ) : (
            <div className="meal-grid">
              {meals.map((meal) => (
                <MealCard meal={meal} key={meal._id} />
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* =================================================
          SUBSCRIPTION PLANS
      ================================================= */}

      {activeTab === "plans" && (
        <motion.section
          className="kitchen-content"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {plans.length === 0 ? (
            <div className="kitchen-empty-text">
              <h3>No subscription plans available</h3>

              <p>This kitchen has not added any subscription plans yet.</p>
            </div>
          ) : (
            <div className="plan-grid">
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  onSubscribe={handleSubscribe}
                  subscribing={subscribing}
                />
              ))}
            </div>
          )}
        </motion.section>
      )}

      <Footer />
    </>
  );
}
