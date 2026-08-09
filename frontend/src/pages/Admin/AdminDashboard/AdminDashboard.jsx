import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserTie,
  FaStore,
  FaUtensils,
  FaClipboardList,
  FaArrowRight,
  FaChartLine,
  FaSyncAlt,
  FaLayerGroup,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProviders: 0,
    totalKitchens: 0,
    totalMeals: 0,
    totalPlans: 0,
  });

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await axiosInstance.get("/admin/dashboard");

      if (res.data?.success) {
        const data = res.data.data || {};

        setStats({
          totalCustomers: Number(data.totalCustomers) || 0,
          totalProviders: Number(data.totalProviders) || 0,
          totalKitchens: Number(data.totalKitchens) || 0,
          totalMeals: Number(data.totalMeals) || 0,
          totalPlans: Number(data.totalPlans) || 0,
        });
      } else {
        toast.error(res.data?.message || "Unable to load admin dashboard.");
      }
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load admin dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: <FaUsers />,
      link: "/admin/customers",
      className: "customers",
    },
    {
      title: "Total Providers",
      value: stats.totalProviders,
      icon: <FaUserTie />,
      link: "/admin/providers",
      className: "providers",
    },
    {
      title: "Total Kitchens",
      value: stats.totalKitchens,
      icon: <FaStore />,
      link: "/admin/kitchens",
      className: "kitchens",
    },
    {
      title: "Total Meals",
      value: stats.totalMeals,
      icon: <FaUtensils />,
      link: "/admin/meals",
      className: "meals",
    },
    {
      title: "Plans",
      value: stats.totalPlans,
      icon: <FaClipboardList />,
      link: "/admin/plans",
      className: "plans",
    },
  ];

  const quickActions = [
    {
      title: "Customers",
      description: "View and manage all registered customers.",
      icon: <FaUsers />,
      link: "/admin/customers",
    },
    {
      title: "Providers",
      description: "Monitor registered meal providers.",
      icon: <FaUserTie />,
      link: "/admin/providers",
    },
    {
      title: "Kitchens",
      description: "View all kitchens available on the platform.",
      icon: <FaStore />,
      link: "/admin/kitchens",
    },
    {
      title: "Meals",
      description: "View and monitor all meals available on MealCart.",
      icon: <FaUtensils />,
      link: "/admin/meals",
    },
    {
      title: "Plans",
      description: "View and manage all meal plans offered on MealCart.",
      icon: <FaClipboardList />,
      link: "/admin/plans",
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="admin-dashboard-page">
          <div className="admin-dashboard-container">
            <div className="admin-skeleton-hero">
              <div className="admin-skeleton admin-skeleton-small" />
              <div className="admin-skeleton admin-skeleton-title" />
              <div className="admin-skeleton admin-skeleton-text" />
            </div>

            <div className="admin-skeleton-stats">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="admin-skeleton-stat" key={item}>
                  <div className="admin-skeleton admin-skeleton-icon" />

                  <div>
                    <div className="admin-skeleton admin-skeleton-number" />
                    <div className="admin-skeleton admin-skeleton-label" />
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-skeleton-section">
              <div className="admin-skeleton admin-skeleton-heading" />

              <div className="admin-skeleton-actions">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div className="admin-skeleton-action" key={item} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <motion.main
        className="admin-dashboard-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="admin-dashboard-container">
          <motion.section
            className="admin-dashboard-hero"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="admin-hero-content">
              <span className="admin-eyebrow">
                <FaChartLine />
                ADMIN CONTROL CENTER
              </span>

              <h1>
                Manage your
                <span> MealCart.</span>
              </h1>

              <p>
                Monitor customers, providers, kitchens, meals and plans from one
                centralized dashboard.
              </p>

              <div className="admin-hero-actions">
                <Link to="/admin/customers" className="admin-primary-btn">
                  View Customers
                  <FaArrowRight />
                </Link>

                <Link to="/admin/providers" className="admin-secondary-btn">
                  Manage Providers
                </Link>
              </div>
            </div>

            <div className="admin-hero-visual">
              <div className="admin-orbit admin-orbit-one" />
              <div className="admin-orbit admin-orbit-two" />

              <div className="admin-hero-icon">
                <FaChartLine />
              </div>

              <span className="admin-floating-icon icon-one">
                <FaUsers />
              </span>

              <span className="admin-floating-icon icon-two">
                <FaStore />
              </span>

              <span className="admin-floating-icon icon-three">
                <FaClipboardList />
              </span>

              <span className="admin-floating-icon icon-four">
                <FaUtensils />
              </span>
            </div>
          </motion.section>

          <section className="admin-stats-grid">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                className={`admin-stat-card ${card.className}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.07,
                }}
                whileHover={{
                  y: -7,
                  transition: { duration: 0.2 },
                }}
              >
                <Link to={card.link} className="admin-stat-link">
                  <div className="admin-stat-icon">{card.icon}</div>

                  <div className="admin-stat-content">
                    <strong>{card.value}</strong>
                    <span>{card.title}</span>
                  </div>

                  <div className="admin-stat-arrow">
                    <FaArrowRight />
                  </div>
                </Link>
              </motion.div>
            ))}
          </section>

          <section className="admin-section">
            <div className="admin-section-heading">
              <div>
                <span className="admin-section-kicker">MANAGEMENT</span>

                <h2>Quick Access</h2>

                <p>Jump directly into any administrative section.</p>
              </div>

              <button
                type="button"
                className="admin-refresh-btn"
                onClick={() => fetchDashboard(true)}
                disabled={refreshing}
              >
                <FaSyncAlt className={refreshing ? "is-spinning" : ""} />

                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="admin-quick-grid">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -6,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link to={action.link} className="admin-quick-card">
                    <div className="admin-quick-icon">{action.icon}</div>

                    <div className="admin-quick-content">
                      <h3>{action.title}</h3>

                      <p>{action.description}</p>
                    </div>

                    <span className="admin-quick-arrow">
                      <FaArrowRight />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.section
            className="admin-overview-panel"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="admin-overview-left">
              <span className="admin-section-kicker">PLATFORM OVERVIEW</span>

              <h2>
                Your MealCart ecosystem
                <span> at a glance.</span>
              </h2>

              <p>
                Keep track of the core platform metrics and quickly navigate to
                the areas that need your attention.
              </p>
            </div>

            <div className="admin-overview-metrics">
              <div>
                <strong>{stats.totalCustomers}</strong>
                <span>Customers</span>
              </div>

              <div>
                <strong>{stats.totalProviders}</strong>
                <span>Providers</span>
              </div>

              <div>
                <strong>{stats.totalKitchens}</strong>
                <span>Kitchens</span>
              </div>

              <div>
                <strong>{stats.totalMeals}</strong>
                <span>Meals</span>
              </div>

              <div>
                <strong>{stats.totalPlans}</strong>
                <span>Plans</span>
              </div>
            </div>
          </motion.section>

          <motion.div
            className="admin-dashboard-live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="admin-live-status">
              <span className="admin-live-dot" />
              <span>Live backend data</span>
            </div>

            <span>Last synced from MealCart server</span>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </>
  );
};

export default AdminDashboard;
