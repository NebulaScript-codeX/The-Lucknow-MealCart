import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaArrowRight,
  FaBell,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaHeart,
  FaMapMarkerAlt,
  FaReceipt,
  FaStar,
  FaUtensils,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";

import "./CustomerDashboard.css";

// =====================================================
// HELPERS
// =====================================================

const formatDate = (date) => {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const formatTime = (date) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return `₹${value.toLocaleString("en-IN")}`;
};

const getStatusClass = (status) => {
  if (!status) return "status-default";

  return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
};

// =====================================================
// COMPONENT
// =====================================================

const CustomerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ===================================================
  // LOAD DASHBOARD
  // ===================================================

  const loadDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [dashboardRes, subscriptionRes] = await Promise.all([
        axiosInstance.get("/customer/dashboard"),
        axiosInstance.get("/plan/my-subscriptions"),
      ]);

      // ==============================
      // CUSTOMER DASHBOARD
      // ==============================

      if (dashboardRes.data?.success) {
        setDashboard(dashboardRes.data.data);
      } else {
        toast.error(dashboardRes.data?.message || "Unable to load dashboard.");
      }

      // ==============================
      // REAL SUBSCRIPTIONS
      // ==============================

      if (subscriptionRes.data?.success) {
        setSubscriptions(
          Array.isArray(subscriptionRes.data.data)
            ? subscriptionRes.data.data
            : [],
        );
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error("Customer Dashboard Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load your dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ===================================================
  // DERIVED DATA
  // ===================================================

  const customer = dashboard?.customer || {};

  const stats = dashboard?.stats || {
    totalSubscriptions: 0,
    totalOrders: 0,
    unreadNotifications: 0,
    totalFavorites: 0,
  };

  const orders = Array.isArray(dashboard?.recentOrders)
    ? dashboard.recentOrders
    : [];

  const notifications = Array.isArray(dashboard?.notifications)
    ? dashboard.notifications
    : [];

  const favorites = Array.isArray(dashboard?.favorites)
    ? dashboard.favorites
    : [];

  const recentOrders = useMemo(() => {
    return orders.slice(0, 3);
  }, [orders]);

  const recentFavorites = useMemo(() => {
    return favorites.slice(0, 4);
  }, [favorites]);

  const recentNotifications = useMemo(() => {
    return notifications.slice(0, 3);
  }, [notifications]);

  const recentSubscriptions = useMemo(() => {
    return subscriptions.slice(0, 3);
  }, [subscriptions]);

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="customer-dashboard">
          <div className="dashboard-container">
            <div className="dashboard-skeleton-hero">
              <div className="skeleton skeleton-small" />
              <div className="skeleton skeleton-large" />
              <div className="skeleton skeleton-medium" />
            </div>

            <div className="dashboard-skeleton-stats">
              {[1, 2, 3, 4].map((item) => (
                <div className="dashboard-skeleton-card" key={item}>
                  <div className="skeleton skeleton-icon" />
                  <div className="skeleton skeleton-number" />
                  <div className="skeleton skeleton-label" />
                </div>
              ))}
            </div>

            <div className="dashboard-skeleton-content">
              <div className="dashboard-skeleton-panel">
                <div className="skeleton skeleton-heading" />

                {[1, 2, 3].map((item) => (
                  <div className="skeleton skeleton-row" key={item} />
                ))}
              </div>

              <div className="dashboard-skeleton-panel">
                <div className="skeleton skeleton-heading" />

                {[1, 2, 3].map((item) => (
                  <div className="skeleton skeleton-row" key={item} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <>
      <Navbar />

      <motion.main
        className="customer-dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-container">
          {/* ==========================================
              HERO
          ========================================== */}

          <motion.section
            className="dashboard-hero"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />

            <div className="dashboard-hero-content">
              <span className="dashboard-eyebrow">
                <FaUtensils />
                MY MEALCART
              </span>

              <h1>
                Welcome back,
                <span> {customer.name || "Foodie"}!</span>
              </h1>

              <p>
                Everything you need to manage your meals, orders and favourites
                — all in one place.
              </p>

              <div className="hero-actions">
                <Link to="/meal/all" className="dashboard-primary-btn">
                  Explore meals
                  <FaArrowRight />
                </Link>

                <Link to="/orders" className="dashboard-secondary-btn">
                  <FaReceipt />
                  My orders
                </Link>
              </div>
            </div>

            <div className="hero-food-orbit">
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />

              <motion.div
                className="hero-food-icon"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🍱
              </motion.div>
            </div>
          </motion.section>

          {/* ==========================================
              STATS
          ========================================== */}

          <section className="dashboard-stats">
            <DashboardStat
              icon={<FaUtensils />}
              value={
                subscriptions.filter((sub) => sub.status === "active").length
              }
              label="Active Subscriptions"
              delay={0}
            />

            <DashboardStat
              icon={<FaBoxOpen />}
              value={stats.totalOrders}
              label="Total Orders"
              delay={0.08}
            />

            <DashboardStat
              icon={<FaBell />}
              value={stats.unreadNotifications}
              label="Unread Alerts"
              delay={0.16}
            />

            <DashboardStat
              icon={<FaHeart />}
              value={stats.totalFavorites}
              label="Favourite Meals"
              delay={0.24}
            />
          </section>

          {/* ==========================================
              QUICK ACTIONS
          ========================================== */}

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">QUICK ACCESS</span>

                <h2>Make your next move</h2>
              </div>
            </div>

            <div className="quick-action-grid">
              <QuickAction
                to="/meal/all"
                icon={<FaUtensils />}
                title="Browse Meals"
                description="Discover fresh meals from local kitchens."
              />

              <QuickAction
                to="/orders"
                icon={<FaReceipt />}
                title="Track Orders"
                description="Check your recent orders and delivery status."
              />

              <QuickAction
                to="/favorites"
                icon={<FaHeart />}
                title="Your Favourites"
                description="Revisit the meals you love."
              />

              <QuickAction
                to="/subscriptions"
                icon={<FaCalendarAlt />}
                title="Meal Plans"
                description="Explore kitchens and subscription plans."
              />

              {/* ==============================
                  REVIEWS & RATINGS — ADDED
              ============================== */}
              <QuickAction
                to="/reviews"
                icon={<FaStar />}
                title="Reviews & Ratings"
                description="Share your experience and manage your reviews."
              />
            </div>
          </section>

          {/* ==========================================
              ORDERS + NOTIFICATIONS
          ========================================== */}

          <section className="dashboard-two-column">
            {/* RECENT ORDERS */}

            <DashboardPanel
              title="Recent Orders"
              kicker="ORDER ACTIVITY"
              link="/orders"
              linkText="View all"
            >
              {recentOrders.length === 0 ? (
                <EmptyState
                  icon={<FaReceipt />}
                  title="No orders yet"
                  description="Your recent orders will appear here."
                  buttonText="Explore meals"
                  buttonTo="/meal/all"
                />
              ) : (
                <div className="dashboard-list">
                  {recentOrders.map((order, index) => {
                    const kitchenName =
                      order.kitchenId?.kitchenName || "Kitchen";

                    const firstItem = order.items?.[0];

                    return (
                      <motion.div
                        className="order-item"
                        key={order._id}
                        initial={{
                          opacity: 0,
                          x: -15,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.08,
                        }}
                      >
                        <div className="order-icon">
                          <FaReceipt />
                        </div>

                        <div className="order-main">
                          <div className="order-top">
                            <h3>{firstItem?.title || "Meal Order"}</h3>

                            <span
                              className={`order-status ${getStatusClass(
                                order.orderStatus,
                              )}`}
                            >
                              {order.orderStatus
                                ?.replace(/-/g, " ")
                                ?.replace(/\b\w/g, (char) =>
                                  char.toUpperCase(),
                                ) || "Placed"}
                            </span>
                          </div>

                          <p className="order-kitchen">
                            <FaUtensils />
                            {kitchenName}
                          </p>

                          <div className="order-meta">
                            <span>
                              {order.items?.length || 0} item
                              {(order.items?.length || 0) !== 1 ? "s" : ""}
                            </span>

                            <span>•</span>

                            <span>{formatDate(order.createdAt)}</span>

                            <span>•</span>

                            <strong>
                              {formatCurrency(order.totalAmount)}
                            </strong>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </DashboardPanel>

            {/* NOTIFICATIONS */}

            <DashboardPanel
              title="Notifications"
              kicker="STAY UPDATED"
              link="/notifications"
              linkText="View all"
            >
              {recentNotifications.length === 0 ? (
                <EmptyState
                  icon={<FaCheckCircle />}
                  title="You're all caught up"
                  description="No new notifications right now."
                />
              ) : (
                <div className="dashboard-list">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      className="notification-item"
                      key={notification._id}
                      initial={{
                        opacity: 0,
                        x: 15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.08,
                      }}
                    >
                      <div className="notification-icon">
                        <FaBell />
                      </div>

                      <div className="notification-main">
                        <div className="notification-title-row">
                          <h3>{notification.title || "Notification"}</h3>

                          {!notification.isRead && (
                            <span className="unread-dot" />
                          )}
                        </div>

                        <p>
                          {notification.message || "You have a new update."}
                        </p>

                        <span className="notification-date">
                          {formatDate(notification.createdAt)} ·{" "}
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </DashboardPanel>
          </section>

          {/* ==========================================
              FAVORITES + SUBSCRIPTIONS
          ========================================== */}

          <section className="dashboard-two-column">
            {/* FAVORITES */}

            <DashboardPanel
              title="Favourite Meals"
              kicker="YOUR PICKS"
              link="/favorites"
              linkText="View favourites"
            >
              {recentFavorites.length === 0 ? (
                <EmptyState
                  icon={<FaHeart />}
                  title="No favourites yet"
                  description="Save meals you love and they'll show up here."
                  buttonText="Find something delicious"
                  buttonTo="/meal/all"
                />
              ) : (
                <div className="favorite-grid">
                  {recentFavorites.map((favorite, index) => {
                    const meal = favorite.mealId;

                    if (!meal) return null;

                    const image = meal.image
                      ? `http://localhost:4000/${meal.image.replace(
                          /\\/g,
                          "/",
                        )}`
                      : null;

                    return (
                      <motion.div
                        className="favorite-card"
                        key={favorite._id}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.07,
                        }}
                      >
                        <Link
                          to={`/meal/${meal._id}`}
                          className="favorite-image"
                        >
                          {image ? (
                            <img src={image} alt={meal.title} />
                          ) : (
                            <div className="favorite-image-placeholder">
                              🍲
                            </div>
                          )}

                          <span className="favorite-heart">
                            <FaHeart />
                          </span>
                        </Link>

                        <div className="favorite-content">
                          <h3>{meal.title}</h3>

                          <span className="favorite-category">
                            {meal.category || "Homestyle meal"}
                          </span>

                          <div className="favorite-bottom">
                            <strong>{formatCurrency(meal.price)}</strong>

                            <Link
                              to={`/meal/${meal._id}`}
                              className="favorite-arrow"
                            >
                              <FaArrowRight />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </DashboardPanel>

            {/* SUBSCRIPTIONS */}

            <DashboardPanel
              title="My Subscriptions"
              kicker="MEAL PLANS"
              link="/my-subscriptions"
              linkText="Manage"
            >
              {recentSubscriptions.length === 0 ? (
                <EmptyState
                  icon={<FaCalendarAlt />}
                  title="No active subscriptions"
                  description="Choose a meal plan and make everyday meals easier."
                  buttonText="Explore plans"
                  buttonTo="/subscriptions"
                />
              ) : (
                <div className="subscription-list">
                  {recentSubscriptions.map((subscription, index) => {
                    const plan =
                      typeof subscription.planId === "object"
                        ? subscription.planId
                        : null;

                    const kitchen =
                      plan && typeof plan.kitchenId === "object"
                        ? plan.kitchenId
                        : null;

                    const isActive = subscription.status === "active";

                    return (
                      <motion.div
                        className={`subscription-item ${
                          isActive
                            ? "subscription-active"
                            : "subscription-inactive"
                        }`}
                        key={subscription._id || index}
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.08,
                        }}
                      >
                        <div className="subscription-icon">
                          <FaCalendarAlt />
                        </div>

                        <div className="subscription-main">
                          <div className="subscription-title-row">
                            <h3>{plan?.title || "Meal Plan"}</h3>

                            <span
                              className={`subscription-status ${
                                isActive ? "active" : "inactive"
                              }`}
                            >
                              {isActive ? "Active" : subscription.status}
                            </span>
                          </div>

                          <p>{kitchen?.kitchenName || "Kitchen"}</p>

                          <div className="subscription-details">
                            <span>
                              <FaCalendarAlt />
                              Next:{" "}
                              {formatDate(subscription.nextDeliveryDate)}
                            </span>

                            <span>
                              <FaBoxOpen />
                              {subscription.mealsLeft ?? "—"} meals left
                            </span>
                          </div>
                        </div>

                        <div className="subscription-price">
                          {formatCurrency(plan?.price ?? subscription.price)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </DashboardPanel>
          </section>

          {/* ==========================================
              CUSTOMER PROFILE STRIP
          ========================================== */}

          <motion.section
            className="dashboard-profile-strip"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
          >
            <div className="profile-avatar">
              {(customer.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
              <span className="profile-label">YOUR ACCOUNT</span>

              <h2>{customer.name || "Customer"}</h2>

              <p>{customer.email || "—"}</p>
            </div>

            <div className="profile-location">
              <FaMapMarkerAlt />

              <div>
                <span>Delivery address</span>

                <strong>
                  {customer.addresses?.[0] || "No address added"}
                </strong>
              </div>
            </div>

            <Link to="/profile" className="profile-button">
              Manage profile
              <FaArrowRight />
            </Link>
          </motion.section>

          {/* ==========================================
              REFRESH
          ========================================== */}

          <div className="dashboard-refresh">
            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh dashboard"}
            </button>
          </div>
        </div>
      </motion.main>

      <Footer />
    </>
  );
};

// =====================================================
// STAT COMPONENT
// =====================================================

const DashboardStat = ({ icon, value, label, delay = 0 }) => {
  return (
    <motion.div
      className="dashboard-stat"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay,
      }}
      whileHover={{
        y: -5,
      }}
    >
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <strong>{value}</strong>

        <span>{label}</span>
      </div>
    </motion.div>
  );
};

// =====================================================
// QUICK ACTION COMPONENT
// =====================================================

const QuickAction = ({ to, icon, title, description }) => {
  return (
    <Link to={to} className="quick-action">
      <div className="quick-action-icon">{icon}</div>

      <div className="quick-action-content">
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <FaArrowRight className="quick-action-arrow" />
    </Link>
  );
};

// =====================================================
// PANEL COMPONENT
// =====================================================

const DashboardPanel = ({ title, kicker, link, linkText, children }) => {
  return (
    <motion.section
      className="dashboard-panel"
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.5,
      }}
    >
      <div className="panel-header">
        <div>
          <span className="panel-kicker">{kicker}</span>

          <h2>{title}</h2>
        </div>

        {link && (
          <Link to={link} className="panel-link">
            {linkText}
            <FaArrowRight />
          </Link>
        )}
      </div>

      <div className="panel-body">{children}</div>
    </motion.section>
  );
};

// =====================================================
// EMPTY STATE
// =====================================================

const EmptyState = ({ icon, title, description, buttonText, buttonTo }) => {
  return (
    <div className="dashboard-empty">
      <div className="empty-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>

      {buttonText && buttonTo && (
        <Link to={buttonTo} className="empty-button">
          {buttonText}
          <FaArrowRight />
        </Link>
      )}
    </div>
  );
};

export default CustomerDashboard;