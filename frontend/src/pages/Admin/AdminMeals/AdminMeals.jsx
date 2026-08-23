import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaLeaf,
  FaDrumstickBite,
  FaClock,
  FaBoxes,
  FaRupeeSign,
  FaStore,
  FaTimes,
  FaFilter,
  FaChevronDown,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./AdminMeals.css";

const AdminMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [mealType, setMealType] = useState("all");
  const [foodType, setFoodType] = useState("all");
  const [availability, setAvailability] = useState("all");

  const [selectedMeal, setSelectedMeal] = useState(null);

  const fetchMeals = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await axiosInstance.get("/meal/all");

      if (res.data?.success) {
        const mealData = Array.isArray(res.data?.meals)
          ? res.data.meals
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setMeals(mealData);
      } else {
        setMeals([]);
        toast.error(res.data?.message || "Unable to load meals.");
      }
    } catch (error) {
      console.error("Admin Meals Error:", error);

      setMeals([]);

      toast.error(error.response?.data?.message || "Unable to fetch meals.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const categories = useMemo(() => {
    const values = meals.map((meal) => meal.category).filter(Boolean);

    return [...new Set(values)].sort();
  }, [meals]);

  const filteredMeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return meals.filter((meal) => {
      const title = String(meal.title || "").toLowerCase();
      const description = String(meal.description || "").toLowerCase();
      const mealCategory = String(meal.category || "").toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        mealCategory.includes(query);

      const matchesCategory =
        category === "all" ||
        String(meal.category || "").toLowerCase() === category.toLowerCase();

      const matchesMealType =
        mealType === "all" ||
        String(meal.mealType || "").toLowerCase() === mealType.toLowerCase();

      const matchesFoodType =
        foodType === "all" ||
        String(meal.vegOrNonVeg || "").toLowerCase() === foodType.toLowerCase();

      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && meal.availability === true) ||
        (availability === "unavailable" && meal.availability === false);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMealType &&
        matchesFoodType &&
        matchesAvailability
      );
    });
  }, [meals, search, category, mealType, foodType, availability]);

  const availableMeals = useMemo(
    () => meals.filter((meal) => meal.availability === true).length,
    [meals],
  );

  const unavailableMeals = useMemo(
    () => meals.filter((meal) => meal.availability === false).length,
    [meals],
  );

  const totalQuantity = useMemo(
    () =>
      meals.reduce(
        (total, meal) => total + Number(meal.quantityAvailable || 0),
        0,
      ),
    [meals],
  );

  // ================= IMAGE URL =================
  // Uses VITE_API_BASE_URL instead of hardcoded localhost.
  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const normalizedPath = String(image)
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

    const serverBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, "");

    return `${serverBaseUrl}/${normalizedPath}`;
  };

  const getKitchenName = (kitchen) => {
    if (!kitchen) {
      return "Kitchen unavailable";
    }

    if (typeof kitchen === "string") {
      return kitchen;
    }

    return (
      kitchen.name ||
      kitchen.title ||
      kitchen.kitchenName ||
      "Kitchen unavailable"
    );
  };

  const formatMealType = (type) => {
    if (!type) {
      return "Meal";
    }

    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMealType("all");
    setFoodType("all");
    setAvailability("all");
  };

  const hasActiveFilters =
    search ||
    category !== "all" ||
    mealType !== "all" ||
    foodType !== "all" ||
    availability !== "all";

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="admin-meals-page">
          <div className="admin-meals-container">
            <section className="admin-meals-loading-hero">
              <div className="admin-meals-skeleton admin-meals-skeleton-kicker" />
              <div className="admin-meals-skeleton admin-meals-skeleton-title" />
              <div className="admin-meals-skeleton admin-meals-skeleton-text" />
            </section>

            <section className="admin-meals-loading-stats">
              {[1, 2, 3, 4].map((item) => (
                <div className="admin-meals-skeleton-stat" key={item}>
                  <div className="admin-meals-skeleton admin-meals-skeleton-stat-icon" />

                  <div>
                    <div className="admin-meals-skeleton admin-meals-skeleton-stat-number" />
                    <div className="admin-meals-skeleton admin-meals-skeleton-stat-label" />
                  </div>
                </div>
              ))}
            </section>

            <section className="admin-meals-loading-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="admin-meal-skeleton-card" key={item}>
                  <div className="admin-meals-skeleton admin-meal-skeleton-image" />

                  <div className="admin-meal-skeleton-content">
                    <div className="admin-meals-skeleton admin-meal-skeleton-line large" />
                    <div className="admin-meals-skeleton admin-meal-skeleton-line" />
                    <div className="admin-meals-skeleton admin-meal-skeleton-line small" />
                  </div>
                </div>
              ))}
            </section>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="admin-meals-page">
        <div className="admin-meals-container">
          <motion.section
            className="admin-meals-hero"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="admin-meals-hero-content">
              <span className="admin-meals-eyebrow">
                <FaUtensils />
                MEAL MANAGEMENT
              </span>

              <h1>
                Explore all
                <span> MealCart meals.</span>
              </h1>

              <p>
                Monitor every meal available on the platform, including pricing,
                kitchen information, availability and inventory.
              </p>

              <div className="admin-meals-hero-actions">
                <div className="admin-meals-total-pill">
                  <FaUtensils />
                  <strong>{meals.length}</strong>
                  <span>Total Meals</span>
                </div>

                <button
                  type="button"
                  className="admin-meals-refresh-btn"
                  onClick={() => fetchMeals(true)}
                  disabled={refreshing}
                >
                  <FaSyncAlt
                    className={refreshing ? "admin-meals-refresh-spin" : ""}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="admin-meals-hero-visual">
              <div className="admin-meals-orbit orbit-one" />
              <div className="admin-meals-orbit orbit-two" />

              <div className="admin-meals-main-icon">
                <FaUtensils />
              </div>

              <span className="admin-meals-floating floating-one">
                <FaLeaf />
              </span>

              <span className="admin-meals-floating floating-two">
                <FaStore />
              </span>

              <span className="admin-meals-floating floating-three">
                <FaDrumstickBite />
              </span>
            </div>
          </motion.section>

          <section className="admin-meals-stat-grid">
            <motion.div
              className="admin-meals-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <div className="admin-meals-stat-icon">
                <FaUtensils />
              </div>

              <div>
                <strong>{meals.length}</strong>
                <span>Total Meals</span>
              </div>
            </motion.div>

            <motion.div
              className="admin-meals-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <div className="admin-meals-stat-icon">
                <FaLeaf />
              </div>

              <div>
                <strong>{availableMeals}</strong>
                <span>Available</span>
              </div>
            </motion.div>

            <motion.div
              className="admin-meals-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="admin-meals-stat-icon">
                <FaClock />
              </div>

              <div>
                <strong>{unavailableMeals}</strong>
                <span>Unavailable</span>
              </div>
            </motion.div>

            <motion.div
              className="admin-meals-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              <div className="admin-meals-stat-icon">
                <FaBoxes />
              </div>

              <div>
                <strong>{totalQuantity}</strong>
                <span>Total Inventory</span>
              </div>
            </motion.div>
          </section>

          <section className="admin-meals-management">
            <div className="admin-meals-section-heading">
              <div>
                <span className="admin-meals-section-kicker">
                  PLATFORM MENU
                </span>

                <h2>All Meals</h2>

                <p>Browse and monitor meals added by MealCart providers.</p>
              </div>

              <div className="admin-meals-result-count">
                <span>{filteredMeals.length}</span>
                results
              </div>
            </div>

            <div className="admin-meals-filters">
              <div className="admin-meals-search">
                <FaSearch />

                <input
                  type="text"
                  placeholder="Search meals, categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="admin-meals-clear-search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="admin-meals-select-wrapper">
                <FaFilter />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>

                  {categories.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <FaChevronDown />
              </div>

              <div className="admin-meals-select-wrapper">
                <FaUtensils />

                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="all">All Meal Types</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>

                <FaChevronDown />
              </div>

              <div className="admin-meals-select-wrapper">
                <FaLeaf />

                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                >
                  <option value="all">Veg & Non-Veg</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>

                <FaChevronDown />
              </div>

              <div className="admin-meals-select-wrapper">
                <FaClock />

                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>

                <FaChevronDown />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="admin-meals-reset-btn"
                  onClick={clearFilters}
                >
                  <FaTimes />
                  Clear
                </button>
              )}
            </div>

            {filteredMeals.length === 0 ? (
              <motion.div
                className="admin-meals-empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="admin-meals-empty-icon">
                  <FaUtensils />
                </div>

                <h3>
                  {meals.length === 0 ? "No meals found" : "No matching meals"}
                </h3>

                <p>
                  {meals.length === 0
                    ? "There are no meals available in the MealCart database yet."
                    : "Try changing your search or filters to find another meal."}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="admin-meals-empty-btn"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="admin-meals-grid">
                <AnimatePresence mode="popLayout">
                  {filteredMeals.map((meal, index) => {
                    const imageUrl = getImageUrl(meal.image);

                    return (
                      <motion.article
                        className="admin-meal-card"
                        key={meal._id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(index * 0.04, 0.35),
                        }}
                        whileHover={{
                          y: -8,
                        }}
                      >
                        <div className="admin-meal-image-wrapper">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={meal.title || "Meal"}
                              className="admin-meal-image"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";

                                const fallback =
                                  e.currentTarget.parentElement?.querySelector(
                                    ".admin-meal-image-fallback",
                                  );

                                if (fallback) {
                                  fallback.style.display = "grid";
                                }
                              }}
                            />
                          ) : null}

                          <div
                            className="admin-meal-image-fallback"
                            style={{
                              display: imageUrl ? "none" : "grid",
                            }}
                          >
                            <FaUtensils />
                          </div>

                          <div className="admin-meal-image-overlay" />

                          <span
                            className={`admin-meal-status ${
                              meal.availability ? "available" : "unavailable"
                            }`}
                          >
                            <span />
                            {meal.availability ? "Available" : "Unavailable"}
                          </span>

                          <span
                            className={`admin-meal-food-badge ${
                              meal.vegOrNonVeg === "veg" ? "veg" : "nonveg"
                            }`}
                          >
                            {meal.vegOrNonVeg === "veg" ? (
                              <FaLeaf />
                            ) : (
                              <FaDrumstickBite />
                            )}

                            {meal.vegOrNonVeg === "veg" ? "VEG" : "NON-VEG"}
                          </span>

                          <button
                            type="button"
                            className="admin-meal-view-btn"
                            onClick={() => setSelectedMeal(meal)}
                            aria-label="View meal"
                          >
                            <FaEye />
                          </button>
                        </div>

                        <div className="admin-meal-card-body">
                          <div className="admin-meal-card-top">
                            <span className="admin-meal-category">
                              {meal.category || "Uncategorized"}
                            </span>

                            <span className="admin-meal-type">
                              {formatMealType(meal.mealType)}
                            </span>
                          </div>

                          <h3>{meal.title || "Untitled Meal"}</h3>

                          <p className="admin-meal-description">
                            {meal.description || "No description available."}
                          </p>

                          <div className="admin-meal-kitchen">
                            <FaStore />

                            <span>{getKitchenName(meal.kitchenId)}</span>
                          </div>

                          <div className="admin-meal-card-footer">
                            <div className="admin-meal-price">
                              <FaRupeeSign />
                              <strong>
                                {Number(meal.price || 0).toLocaleString(
                                  "en-IN",
                                )}
                              </strong>
                            </div>

                            <div className="admin-meal-quantity">
                              <FaBoxes />
                              <span>
                                {Number(meal.quantityAvailable || 0)} available
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </section>

          <motion.div
            className="admin-meals-live-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <span className="admin-meals-live-dot" />
              <strong>Live backend data</strong>
            </div>

            <span>Meals synced directly from MealCart server</span>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {selectedMeal && (
          <motion.div
            className="admin-meal-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div
              className="admin-meal-modal"
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="admin-meal-modal-close"
                onClick={() => setSelectedMeal(null)}
              >
                <FaTimes />
              </button>

              <div className="admin-meal-modal-image">
                {getImageUrl(selectedMeal.image) ? (
                  <img
                    src={getImageUrl(selectedMeal.image)}
                    alt={selectedMeal.title}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <FaUtensils />
                )}
              </div>

              <div className="admin-meal-modal-content">
                <span className="admin-meals-section-kicker">MEAL DETAILS</span>

                <h2>{selectedMeal.title || "Untitled Meal"}</h2>

                <p className="admin-meal-modal-description">
                  {selectedMeal.description || "No description available."}
                </p>

                <div className="admin-meal-modal-tags">
                  <span>{selectedMeal.category || "Uncategorized"}</span>

                  <span>{formatMealType(selectedMeal.mealType)}</span>

                  <span
                    className={
                      selectedMeal.vegOrNonVeg === "veg" ? "veg" : "nonveg"
                    }
                  >
                    {selectedMeal.vegOrNonVeg === "veg"
                      ? "Vegetarian"
                      : "Non-Vegetarian"}
                  </span>
                </div>

                <div className="admin-meal-modal-info">
                  <div>
                    <span>Price</span>

                    <strong>
                      ₹{Number(selectedMeal.price || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Quantity</span>

                    <strong>
                      {Number(selectedMeal.quantityAvailable || 0)}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <strong
                      className={
                        selectedMeal.availability
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {selectedMeal.availability ? "Available" : "Unavailable"}
                    </strong>
                  </div>

                  <div>
                    <span>Kitchen</span>

                    <strong>{getKitchenName(selectedMeal.kitchenId)}</strong>
                  </div>
                </div>

                <div className="admin-meal-modal-actions">
                  <Link
                    to={`/meal/${selectedMeal._id}`}
                    className="admin-meal-modal-primary"
                  >
                    Open Meal
                    <FaEye />
                  </Link>

                  <button
                    type="button"
                    className="admin-meal-modal-secondary"
                    onClick={() => setSelectedMeal(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default AdminMeals;
