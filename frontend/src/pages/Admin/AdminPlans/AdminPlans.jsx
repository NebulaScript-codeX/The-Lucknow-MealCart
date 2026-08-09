import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCrown,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaStore,
  FaCalendarAlt,
  FaUtensils,
  FaRupeeSign,
  FaClock,
  FaTimes,
  FaFilter,
  FaChevronDown,
  FaCheckCircle,
  FaLayerGroup,
  FaFire,
} from "react-icons/fa";
import toast from "react-hot-toast";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./AdminPlans.css";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [duration, setDuration] = useState("all");
  const [status, setStatus] = useState("all");

  const [selectedPlan, setSelectedPlan] = useState(null);

  // ================================
  // FETCH ALL PLANS
  // ================================

  const fetchPlans = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await axiosInstance.get("/plan/all");

      if (res.data?.success) {
        const planData = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.plans)
            ? res.data.plans
            : [];

        setPlans(planData);
      } else {
        setPlans([]);

        toast.error(res.data?.message || "Unable to load subscription plans.");
      }
    } catch (error) {
      console.error("Admin Plans Error:", error);

      setPlans([]);

      toast.error(
        error.response?.data?.message || "Unable to fetch subscription plans.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ================================
  // HELPERS
  // ================================

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

  const formatDuration = (value) => {
    if (!value) {
      return "Plan";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // ================================
  // FILTERING
  // ================================

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return plans.filter((plan) => {
      const title = String(plan.title || "").toLowerCase();
      const description = String(plan.description || "").toLowerCase();
      const kitchenName = getKitchenName(plan.kitchenId).toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        kitchenName.includes(query);

      const matchesDuration =
        duration === "all" ||
        String(plan.duration || "").toLowerCase() === duration.toLowerCase();

      const matchesStatus =
        status === "all" ||
        (status === "active" && plan.isActive === true) ||
        (status === "inactive" && plan.isActive === false);

      return matchesSearch && matchesDuration && matchesStatus;
    });
  }, [plans, search, duration, status]);

  // ================================
  // STATS
  // ================================

  const activePlans = useMemo(
    () => plans.filter((plan) => plan.isActive === true).length,
    [plans],
  );

  const inactivePlans = useMemo(
    () => plans.filter((plan) => plan.isActive === false).length,
    [plans],
  );

  const weeklyPlans = useMemo(
    () =>
      plans.filter(
        (plan) => String(plan.duration || "").toLowerCase() === "weekly",
      ).length,
    [plans],
  );

  const monthlyPlans = useMemo(
    () =>
      plans.filter(
        (plan) => String(plan.duration || "").toLowerCase() === "monthly",
      ).length,
    [plans],
  );

  const totalMeals = useMemo(
    () =>
      plans.reduce((total, plan) => total + Number(plan.totalMeals || 0), 0),
    [plans],
  );

  // ================================
  // CLEAR FILTERS
  // ================================

  const clearFilters = () => {
    setSearch("");
    setDuration("all");
    setStatus("all");
  };

  const hasActiveFilters = search || duration !== "all" || status !== "all";

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="admin-plans-page">
          <div className="admin-plans-container">
            <section className="admin-plans-loading-hero">
              <div className="admin-plans-skeleton admin-plans-skeleton-kicker" />

              <div className="admin-plans-skeleton admin-plans-skeleton-title" />

              <div className="admin-plans-skeleton admin-plans-skeleton-text" />
            </section>

            <section className="admin-plans-loading-stats">
              {[1, 2, 3, 4].map((item) => (
                <div className="admin-plans-skeleton-stat" key={item}>
                  <div className="admin-plans-skeleton admin-plans-skeleton-icon" />

                  <div>
                    <div className="admin-plans-skeleton admin-plans-skeleton-number" />

                    <div className="admin-plans-skeleton admin-plans-skeleton-label" />
                  </div>
                </div>
              ))}
            </section>

            <section className="admin-plans-loading-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div className="admin-plan-skeleton-card" key={item}>
                  <div className="admin-plans-skeleton admin-plan-skeleton-top" />

                  <div className="admin-plan-skeleton-content">
                    <div className="admin-plans-skeleton admin-plan-skeleton-line large" />

                    <div className="admin-plans-skeleton admin-plan-skeleton-line" />

                    <div className="admin-plans-skeleton admin-plan-skeleton-line small" />
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

  // ================================
  // MAIN UI
  // ================================

  return (
    <>
      <Navbar />

      <main className="admin-plans-page">
        <div className="admin-plans-container">
          {/* ================= HERO ================= */}

          <motion.section
            className="admin-plans-hero"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="admin-plans-hero-content">
              <span className="admin-plans-eyebrow">
                <FaCrown />
                SUBSCRIPTION MANAGEMENT
              </span>

              <h1>
                Manage all
                <span> MealCart plans.</span>
              </h1>

              <p>
                Monitor subscription plans offered by kitchens, including
                pricing, duration, meal limits and availability.
              </p>

              <div className="admin-plans-hero-actions">
                <div className="admin-plans-total-pill">
                  <FaLayerGroup />

                  <strong>{plans.length}</strong>

                  <span>Total Plans</span>
                </div>

                <button
                  type="button"
                  className="admin-plans-refresh-btn"
                  onClick={() => fetchPlans(true)}
                  disabled={refreshing}
                >
                  <FaSyncAlt
                    className={refreshing ? "admin-plans-refresh-spin" : ""}
                  />

                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="admin-plans-hero-visual">
              <div className="admin-plans-orbit orbit-one" />

              <div className="admin-plans-orbit orbit-two" />

              <div className="admin-plans-main-icon">
                <FaCrown />
              </div>

              <span className="admin-plans-floating floating-one">
                <FaUtensils />
              </span>

              <span className="admin-plans-floating floating-two">
                <FaStore />
              </span>

              <span className="admin-plans-floating floating-three">
                <FaFire />
              </span>
            </div>
          </motion.section>

          {/* ================= STATS ================= */}

          <section className="admin-plans-stat-grid">
            <motion.div
              className="admin-plans-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <div className="admin-plans-stat-icon">
                <FaLayerGroup />
              </div>

              <div>
                <strong>{plans.length}</strong>
                <span>Total Plans</span>
              </div>
            </motion.div>

            <motion.div
              className="admin-plans-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <div className="admin-plans-stat-icon">
                <FaCheckCircle />
              </div>

              <div>
                <strong>{activePlans}</strong>
                <span>Active Plans</span>
              </div>
            </motion.div>

            <motion.div
              className="admin-plans-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="admin-plans-stat-icon">
                <FaCalendarAlt />
              </div>

              <div>
                <strong>{weeklyPlans}</strong>
                <span>Weekly Plans</span>
              </div>
            </motion.div>

            <motion.div
              className="admin-plans-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              <div className="admin-plans-stat-icon">
                <FaClock />
              </div>

              <div>
                <strong>{monthlyPlans}</strong>
                <span>Monthly Plans</span>
              </div>
            </motion.div>
          </section>

          {/* ================= MANAGEMENT ================= */}

          <section className="admin-plans-management">
            <div className="admin-plans-section-heading">
              <div>
                <span className="admin-plans-section-kicker">
                  SUBSCRIPTION CATALOG
                </span>

                <h2>All Plans</h2>

                <p>
                  Browse and monitor subscription plans created by MealCart
                  providers.
                </p>
              </div>

              <div className="admin-plans-result-count">
                <span>{filteredPlans.length}</span>
                results
              </div>
            </div>

            {/* ================= FILTERS ================= */}

            <div className="admin-plans-filters">
              <div className="admin-plans-search">
                <FaSearch />

                <input
                  type="text"
                  placeholder="Search plans, kitchens..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <button
                    type="button"
                    className="admin-plans-clear-search"
                    onClick={() => setSearch("")}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              <div className="admin-plans-select-wrapper">
                <FaCalendarAlt />

                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="all">All Durations</option>

                  <option value="weekly">Weekly</option>

                  <option value="monthly">Monthly</option>
                </select>

                <FaChevronDown />
              </div>

              <div className="admin-plans-select-wrapper">
                <FaFilter />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All Status</option>

                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>
                </select>

                <FaChevronDown />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="admin-plans-reset-btn"
                  onClick={clearFilters}
                >
                  <FaTimes />
                  Clear
                </button>
              )}
            </div>

            {/* ================= EMPTY ================= */}

            {filteredPlans.length === 0 ? (
              <motion.div
                className="admin-plans-empty"
                initial={{
                  opacity: 0,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >
                <div className="admin-plans-empty-icon">
                  <FaCrown />
                </div>

                <h3>
                  {plans.length === 0 ? "No plans found" : "No matching plans"}
                </h3>

                <p>
                  {plans.length === 0
                    ? "There are no active subscription plans available in the MealCart database."
                    : "Try changing your search or filters to find another plan."}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    className="admin-plans-empty-btn"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            ) : (
              /* ================= PLAN GRID ================= */

              <div className="admin-plans-grid">
                <AnimatePresence mode="popLayout">
                  {filteredPlans.map((plan, index) => (
                    <motion.article
                      className="admin-plan-card"
                      key={plan._id}
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
                        delay: Math.min(index * 0.05, 0.35),
                      }}
                      whileHover={{
                        y: -8,
                      }}
                    >
                      {/* CARD TOP */}

                      <div className="admin-plan-card-top">
                        <div className="admin-plan-crown">
                          <FaCrown />
                        </div>

                        <div className="admin-plan-status">
                          <span />

                          {plan.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>

                      {/* PLAN INFO */}

                      <div className="admin-plan-card-content">
                        <div className="admin-plan-duration">
                          <FaCalendarAlt />

                          {formatDuration(plan.duration)}
                        </div>

                        <h3>{plan.title || "Untitled Plan"}</h3>

                        <p className="admin-plan-description">
                          {plan.description || "No description available."}
                        </p>

                        {/* KITCHEN */}

                        <div className="admin-plan-kitchen">
                          <FaStore />

                          <span>{getKitchenName(plan.kitchenId)}</span>
                        </div>

                        {/* DETAILS */}

                        <div className="admin-plan-details">
                          <div>
                            <FaUtensils />

                            <span>
                              {Number(plan.mealsPerDay || 0)} meals/day
                            </span>
                          </div>

                          <div>
                            <FaLayerGroup />

                            <span>
                              {Number(plan.totalMeals || 0)} total meals
                            </span>
                          </div>
                        </div>

                        {/* FOOTER */}

                        <div className="admin-plan-card-footer">
                          <div className="admin-plan-price">
                            <FaRupeeSign />

                            <strong>{formatPrice(plan.price)}</strong>

                            <span>
                              /{plan.duration === "weekly" ? "week" : "month"}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="admin-plan-view-btn"
                            onClick={() => setSelectedPlan(plan)}
                            aria-label="View plan"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* ================= LIVE BAR ================= */}

          <motion.div
            className="admin-plans-live-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <span className="admin-plans-live-dot" />

              <strong>Live backend data</strong>
            </div>

            <span>Plans synced directly from MealCart server</span>
          </motion.div>
        </div>
      </main>

      {/* ================= MODAL ================= */}

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            className="admin-plan-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              className="admin-plan-modal"
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
                className="admin-plan-modal-close"
                onClick={() => setSelectedPlan(null)}
              >
                <FaTimes />
              </button>

              {/* MODAL HEADER */}

              <div className="admin-plan-modal-header">
                <div className="admin-plan-modal-icon">
                  <FaCrown />
                </div>

                <div>
                  <span className="admin-plans-section-kicker">
                    PLAN DETAILS
                  </span>

                  <h2>{selectedPlan.title || "Untitled Plan"}</h2>
                </div>
              </div>

              <p className="admin-plan-modal-description">
                {selectedPlan.description || "No description available."}
              </p>

              {/* TAGS */}

              <div className="admin-plan-modal-tags">
                <span>
                  <FaCalendarAlt />

                  {formatDuration(selectedPlan.duration)}
                </span>

                <span>
                  <FaStore />

                  {getKitchenName(selectedPlan.kitchenId)}
                </span>

                <span className={selectedPlan.isActive ? "active" : "inactive"}>
                  <FaCheckCircle />

                  {selectedPlan.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* INFO */}

              <div className="admin-plan-modal-info">
                <div>
                  <span>Price</span>

                  <strong>₹{formatPrice(selectedPlan.price)}</strong>
                </div>

                <div>
                  <span>Duration</span>

                  <strong>{formatDuration(selectedPlan.duration)}</strong>
                </div>

                <div>
                  <span>Meals Per Day</span>

                  <strong>{Number(selectedPlan.mealsPerDay || 0)}</strong>
                </div>

                <div>
                  <span>Total Meals</span>

                  <strong>{Number(selectedPlan.totalMeals || 0)}</strong>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="admin-plan-modal-actions">
                <button
                  type="button"
                  className="admin-plan-modal-secondary"
                  onClick={() => setSelectedPlan(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default AdminPlans;
