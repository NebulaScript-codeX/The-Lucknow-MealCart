import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBolt,
  FaBoxOpen,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaCoins,
  FaFire,
  FaRedoAlt,
  FaStore,
  FaUtensils,
  FaUsers,
  FaTruck,
  FaClipboardList,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH DASHBOARD + PLANS
  // =========================================================
  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // Fetch dashboard and provider plans together
      const [dashboardResponse, plansResponse] = await Promise.all([
        axiosInstance.get("/provider/dashboard"),
        axiosInstance.get("/plan/my-plans"),
      ]);

      // =========================
      // DASHBOARD DATA
      // =========================
      if (dashboardResponse?.data?.success) {
        setDashboard(dashboardResponse.data.data);
      } else {
        throw new Error(
          dashboardResponse?.data?.message ||
            "Failed to load provider dashboard",
        );
      }

      // =========================
      // PLANS DATA
      // =========================
      if (plansResponse?.data?.success) {
        setPlans(plansResponse.data.data || []);
      } else {
        // Don't break the complete dashboard
        // if only plans API fails.
        console.warn(
          "Plans API failed:",
          plansResponse?.data?.message || "Unable to fetch plans",
        );

        setPlans([]);
      }
    } catch (err) {
      console.error("Provider dashboard error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load dashboard";

      setError(message);

      if (isRefresh) {
        toast.error("Unable to refresh dashboard");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // =========================================================
  // INITIAL FETCH
  // =========================================================
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // =========================================================
  // HELPERS
  // =========================================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "delivered") return "status-delivered";
    if (normalized === "accepted") return "status-accepted";
    if (normalized === "preparing") return "status-preparing";
    if (normalized === "out-for-delivery") return "status-delivery";
    if (normalized === "placed") return "status-placed";
    if (normalized === "cancelled") return "status-cancelled";

    return "status-default";
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <>
        <main className="provider-dashboard">
          <div className="provider-dashboard-shell provider-dashboard-loading">
            <div className="dashboard-loading-hero shimmer" />

            <div className="dashboard-loading-heading shimmer" />

            <div className="dashboard-loading-grid">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="dashboard-loading-card shimmer"
                  key={item}
                />
              ))}
            </div>

            <div className="dashboard-loading-content">
              <div className="dashboard-loading-panel shimmer" />
              <div className="dashboard-loading-panel shimmer" />
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================
  if (error || !dashboard) {
    return (
      <>
        <main className="provider-dashboard">
          <div className="provider-dashboard-shell">
            <motion.div
              className="dashboard-error-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="error-icon">
                <FaStore />
              </div>

              <h2>Dashboard couldn't load</h2>

              <p>
                Something went wrong while loading your kitchen overview.
                Please try again.
              </p>

              <button
                type="button"
                className="dashboard-primary-btn"
                onClick={() => fetchDashboard()}
              >
                <FaRedoAlt />
                Try Again
              </button>
            </motion.div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // DATA
  // =========================================================
  const provider = dashboard?.provider || {};
  const kitchen = dashboard?.kitchen || {};
  const stats = dashboard?.stats || {};
  const recentOrders = dashboard?.recentOrders || [];

  // =========================================================
  // PLAN DATA
  // IMPORTANT:
  // Plans are fetched separately from /plan/my-plans
  // =========================================================
  const totalPlans = plans.length;

  const activePlans = plans.filter(
    (plan) => plan?.isActive !== false,
  ).length;

  const totalPlanMeals = plans.reduce(
    (sum, plan) => sum + Number(plan?.totalMeals || 0),
    0,
  );

  // =========================================================
  // STAT CARDS
  // =========================================================
  const statCards = [
    {
      title: "Total Meals",
      value: stats.totalMeals ?? kitchen.totalMeals ?? 0,
      helper: "Active meals",
      icon: FaUtensils,
      className: "meals-card",
      link: "/provider/meals",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders ?? 0,
      helper: "Orders received",
      icon: FaClipboardList,
      className: "orders-card",
      link: "/provider/orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders ?? 0,
      helper: "Need attention",
      icon: FaClock,
      className: "pending-card",
      link: "/provider/orders",
    },
    {
      title: "Plans",
      value: totalPlans,
      helper:
        activePlans === 1
          ? "1 active plan"
          : `${activePlans} active plans`,
      icon: FaUsers,
      className: "subscribers-card",
      link: "/provider/plans",
    },
  ];

  // =========================================================
  // ORDER STATUS DATA
  // =========================================================
  const orderStatusData = [
    {
      label: "Accepted",
      value: stats.acceptedOrders ?? 0,
      icon: FaCheckCircle,
      className: "accepted",
    },
    {
      label: "Preparing",
      value: stats.preparingOrders ?? 0,
      icon: FaFire,
      className: "preparing",
    },
    {
      label: "Out for Delivery",
      value: stats.outForDeliveryOrders ?? 0,
      icon: FaTruck,
      className: "out-delivery",
    },
    {
      label: "Delivered",
      value: stats.deliveredOrders ?? 0,
      icon: FaCheckCircle,
      className: "delivered",
    },
  ];

  return (
    <>
      <main className="provider-dashboard">
        <div className="provider-dashboard-shell">

          {/* =====================================================
              HERO
          ====================================================== */}
          <motion.section
            className="provider-hero"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />

            <div className="provider-hero-content">
              <motion.div
                className="provider-eyebrow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <FaBolt />
                <span>Provider Control Center</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back,{" "}
                <span>{provider.name || "Provider"}</span>
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                Keep your kitchen running smoothly, monitor orders and stay
                ahead of your daily performance.
              </motion.p>

              <div className="hero-meta">
                <div className="hero-meta-item">
                  <span className="hero-meta-icon">
                    <FaStore />
                  </span>

                  <div>
                    <small>Kitchen</small>
                    <strong>
                      {kitchen.kitchenName || "Your Kitchen"}
                    </strong>
                  </div>
                </div>

                <div className="hero-meta-divider" />

                <div className="hero-meta-item">
                  <span className="hero-meta-icon">
                    <FaClock />
                  </span>

                  <div>
                    <small>Timings</small>
                    <strong>{kitchen.timings || "Not set"}</strong>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="kitchen-preview-card"
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
              whileHover={{ y: -8 }}
            >
              <div className="kitchen-preview-top">
                <div className="kitchen-preview-icon">
                  <FaStore />
                </div>

                <div
                  className={`kitchen-status ${
                    kitchen.openStatus
                      ? "kitchen-status-open"
                      : "kitchen-status-closed"
                  }`}
                >
                  <FaCircle />

                  {kitchen.openStatus
                    ? "Kitchen Open"
                    : "Kitchen Closed"}
                </div>
              </div>

              <h3>{kitchen.kitchenName || "Your Kitchen"}</h3>

              <p>
                {kitchen.description ||
                  "Manage your meals, orders and kitchen performance from one place."}
              </p>

              <div className="kitchen-mini-stats">
                <div>
                  <span>
                    <FaUtensils />
                  </span>

                  <div>
                    <strong>{stats.totalMeals ?? 0}</strong>
                    <small>Meals</small>
                  </div>
                </div>

                <div>
                  <span>
                    <FaUsers />
                  </span>

                  <div>
                    <strong>{totalPlans}</strong>
                    <small>Plans</small>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* =====================================================
              SECTION HEADER
          ====================================================== */}
          <div className="dashboard-section-header">
            <div>
              <span className="section-kicker">Kitchen Overview</span>

              <h2>Today's Performance</h2>

              <p>
                Here's how your kitchen is performing right now.
              </p>
            </div>

            <motion.button
              type="button"
              className="refresh-btn"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <FaRedoAlt
                className={refreshing ? "spin-icon" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
          </div>

          {/* =====================================================
              STAT CARDS
          ====================================================== */}
          <section className="provider-stat-grid">
            {statCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  className={`provider-stat-card ${card.className}`}
                  key={card.title}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.1 + index * 0.08,
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link
                    to={card.link}
                    className="stat-card-link"
                  >
                    <div className="stat-card-top">
                      <div className="stat-icon">
                        <Icon />
                      </div>

                      <span className="stat-arrow">
                        <FaArrowRight />
                      </span>
                    </div>

                    <div className="stat-card-content">
                      <span className="stat-label">
                        {card.title}
                      </span>

                      <strong className="stat-value">
                        {card.value}
                      </strong>

                      <span className="stat-helper">
                        {card.helper}
                      </span>
                    </div>

                    <div className="stat-card-decoration" />
                  </Link>
                </motion.div>
              );
            })}
          </section>

          {/* =====================================================
              MAIN GRID
          ====================================================== */}
          <section className="dashboard-main-grid">

            {/* ================= RECENT ORDERS ================= */}
            <motion.div
              className="dashboard-panel orders-panel"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">
                    Live Activity
                  </span>

                  <h3>Recent Orders</h3>
                </div>

                <Link
                  to="/provider/orders"
                  className="panel-link"
                >
                  View All
                  <FaChevronRight />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="dashboard-empty-state">
                  <div className="empty-icon">
                    <FaBoxOpen />
                  </div>

                  <h4>No recent orders</h4>

                  <p>
                    Your latest customer orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="orders-list">
                  {recentOrders.slice(0, 5).map((order, index) => (
                    <motion.div
                      className="recent-order"
                      key={order._id || index}
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.4 + index * 0.06,
                      }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="order-avatar">
                        {order?.customerId?.name
                          ? order.customerId.name
                              .charAt(0)
                              .toUpperCase()
                          : "C"}
                      </div>

                      <div className="order-info">
                        <div className="order-title-row">
                          <h4>
                            {order?.customerId?.name ||
                              "Customer"}
                          </h4>

                          <span
                            className={`order-status ${getStatusClass(
                              order.orderStatus,
                            )}`}
                          >
                            {getStatusLabel(
                              order.orderStatus,
                            )}
                          </span>
                        </div>

                        <p>
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? "item"
                            : "items"}

                          <span>•</span>

                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="order-price">
                        <strong>
                          {formatCurrency(
                            order.totalAmount,
                          )}
                        </strong>

                        <span>
                          {order.paymentMethod || "N/A"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ================= PERFORMANCE ================= */}
            <motion.div
              className="dashboard-panel performance-panel"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
            >
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">
                    Order Flow
                  </span>

                  <h3>Order Performance</h3>
                </div>

                <div className="performance-icon">
                  <FaChartLine />
                </div>
              </div>

              <div className="performance-total">
                <div>
                  <span>Total Orders</span>

                  <strong>
                    {stats.totalOrders ?? 0}
                  </strong>
                </div>

                <div className="performance-growth">
                  <FaChartLine />

                  <span>Overview</span>
                </div>
              </div>

              <div className="order-status-list">
                {orderStatusData.map((item, index) => {
                  const Icon = item.icon;

                  const percentage = stats.totalOrders
                    ? Math.min(
                        (item.value / stats.totalOrders) * 100,
                        100,
                      )
                    : 0;

                  return (
                    <motion.div
                      className="order-status-item"
                      key={item.label}
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: 0.5 + index * 0.07,
                      }}
                    >
                      <div
                        className={`order-status-icon ${item.className}`}
                      >
                        <Icon />
                      </div>

                      <div className="order-status-info">
                        <span>{item.label}</span>

                        <div className="status-progress">
                          <div
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      <strong>{item.value}</strong>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </section>

          {/* =====================================================
              BOTTOM GRID
          ====================================================== */}
          <section className="dashboard-bottom-grid">

            {/* ================= EARNINGS ================= */}
            <motion.div
              className="earnings-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <div className="earnings-glow" />

              <div className="earnings-icon">
                <FaCoins />
              </div>

              <div className="earnings-content">
                <span>Total Earnings</span>

                <strong>
                  {formatCurrency(stats.totalEarnings)}
                </strong>

                <p>
                  Based on your current dashboard activity.
                </p>
              </div>

              <div className="earnings-graph">
                <FaChartLine />
              </div>
            </motion.div>

            {/* ================= KITCHEN DETAILS ================= */}
            <motion.div
              className="dashboard-panel kitchen-details-panel"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56 }}
            >
              <div className="panel-header">
                <div>
                  <span className="panel-kicker">
                    Kitchen Details
                  </span>

                  <h3>Quick Overview</h3>
                </div>

                <div className="performance-icon">
                  <FaStore />
                </div>
              </div>

              <div className="kitchen-detail-grid">
                <div className="kitchen-detail-item">
                  <span>
                    <FaMapMarkerAlt />
                  </span>

                  <div>
                    <small>Delivery Areas</small>

                    <strong>
                      {kitchen.deliveryAreas?.length
                        ? kitchen.deliveryAreas.join(", ")
                        : "Not added"}
                    </strong>
                  </div>
                </div>

                <div className="kitchen-detail-item">
                  <span>
                    <FaClock />
                  </span>

                  <div>
                    <small>Estimated Delivery</small>

                    <strong>
                      {kitchen.estimatedDeliveryTime ||
                        "Not set"}
                    </strong>
                  </div>
                </div>

                <div className="kitchen-detail-item">
                  <span>
                    <FaCoins />
                  </span>

                  <div>
                    <small>Minimum Order</small>

                    <strong>
                      {formatCurrency(
                        kitchen.minimumOrderAmount,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="kitchen-detail-item">
                  <span>
                    <FaCalendarAlt />
                  </span>

                  <div>
                    <small>Kitchen Since</small>

                    <strong>
                      {formatDate(kitchen.createdAt)}
                    </strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* =====================================================
              QUICK ACTIONS
          ====================================================== */}
          <motion.section
            className="quick-actions-section"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62 }}
          >
            <div className="dashboard-section-header compact">
              <div>
                <span className="section-kicker">
                  Manage Kitchen
                </span>

                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="quick-actions-grid">
              <Link
                to="/provider/meals"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  <FaUtensils />
                </span>

                <div>
                  <strong>Manage Meals</strong>
                  <small>
                    Add, edit or remove meals
                  </small>
                </div>

                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link
                to="/provider/orders"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  <FaClipboardList />
                </span>

                <div>
                  <strong>Manage Orders</strong>
                  <small>
                    Review and update orders
                  </small>
                </div>

                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link
                to="/provider/plans"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  <FaUsers />
                </span>

                <div>
                  <strong>Subscription Plans</strong>
                  <small>
                    Manage your meal plans
                  </small>
                </div>

                <FaArrowRight className="quick-action-arrow" />
              </Link>

              <Link
                to="/provider/kitchen"
                className="quick-action"
              >
                <span className="quick-action-icon">
                  <FaStore />
                </span>

                <div>
                  <strong>Kitchen Profile</strong>
                  <small>
                    Update kitchen information
                  </small>
                </div>

                <FaArrowRight className="quick-action-arrow" />
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProviderDashboard;