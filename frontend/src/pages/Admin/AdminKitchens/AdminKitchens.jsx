import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaSearch,
  FaStore,
  FaSyncAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaUtensils,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./AdminKitchens.css";

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

const getKitchenName = (kitchen) => {
  return (
    kitchen.name || kitchen.kitchenName || kitchen.title || "Unnamed Kitchen"
  );
};

const getKitchenLocation = (kitchen) => {
  if (typeof kitchen.address === "string") return kitchen.address;

  if (kitchen.address?.city) {
    return kitchen.address.city;
  }

  if (kitchen.location) {
    if (typeof kitchen.location === "string") return kitchen.location;

    return (
      kitchen.location.city ||
      kitchen.location.address ||
      "Location unavailable"
    );
  }

  return kitchen.city || "Location unavailable";
};

const AdminKitchens = () => {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchKitchens = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axiosInstance.get("/admin/kitchens");

      if (response.data?.success) {
        setKitchens(
          Array.isArray(response.data.data) ? response.data.data : [],
        );
      } else {
        toast.error(response.data?.message || "Unable to load kitchens.");
      }
    } catch (error) {
      console.error("Admin Kitchens Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load kitchen data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKitchens();
  }, []);

  const filteredKitchens = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return kitchens;

    return kitchens.filter((kitchen) => {
      const name = getKitchenName(kitchen).toLowerCase();
      const location = getKitchenLocation(kitchen).toLowerCase();

      const email = String(
        kitchen.email || kitchen.contactEmail || "",
      ).toLowerCase();

      return (
        name.includes(keyword) ||
        location.includes(keyword) ||
        email.includes(keyword)
      );
    });
  }, [kitchens, search]);

  const activeKitchens = useMemo(() => {
    return kitchens.filter(
      (kitchen) => kitchen.isActive !== false && kitchen.status !== "inactive",
    ).length;
  }, [kitchens]);

  const inactiveKitchens = kitchens.length - activeKitchens;

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="admin-kitchens-page">
          <div className="admin-kitchens-container">
            <div className="admin-kitchens-loading">
              <div className="admin-skeleton admin-skeleton-title" />
              <div className="admin-skeleton admin-skeleton-subtitle" />

              <div className="admin-kitchen-stat-skeletons">
                {[1, 2, 3].map((item) => (
                  <div className="admin-kitchen-stat-skeleton" key={item}>
                    <div className="admin-skeleton admin-skeleton-circle" />

                    <div>
                      <div className="admin-skeleton admin-skeleton-number" />
                      <div className="admin-skeleton admin-skeleton-text" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-skeleton admin-skeleton-search" />

              <div className="admin-kitchen-grid-skeleton">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div className="admin-kitchen-card-skeleton" key={item}>
                    <div className="admin-skeleton admin-skeleton-avatar" />
                    <div className="admin-skeleton admin-skeleton-card-title" />
                    <div className="admin-skeleton admin-skeleton-card-line" />
                    <div className="admin-skeleton admin-skeleton-card-line small" />
                  </div>
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
        className="admin-kitchens-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-kitchens-container">
          <motion.div
            className="admin-kitchens-topbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="admin-kitchens-heading">
              <Link to="/admin/dashboard" className="admin-back-button">
                <FaArrowLeft />
                Dashboard
              </Link>

              <span className="admin-page-kicker">ADMIN MANAGEMENT</span>

              <h1>Kitchens</h1>

              <p>Manage and monitor every kitchen registered on MealCart.</p>
            </div>

            <motion.button
              type="button"
              className="admin-refresh-button"
              onClick={() => fetchKitchens(true)}
              disabled={refreshing}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <FaSyncAlt className={refreshing ? "spinning" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
          </motion.div>

          <section className="admin-kitchen-overview">
            <motion.div
              className="admin-kitchen-overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="admin-overview-icon">
                <FaStore />
              </div>

              <div>
                <span>Total Kitchens</span>
                <strong>{kitchens.length}</strong>
              </div>
            </motion.div>

            <motion.div
              className="admin-kitchen-overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -6 }}
            >
              <div className="admin-overview-icon active">
                <FaCheckCircle />
              </div>

              <div>
                <span>Active Kitchens</span>
                <strong>{activeKitchens}</strong>
              </div>
            </motion.div>

            <motion.div
              className="admin-kitchen-overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              whileHover={{ y: -6 }}
            >
              <div className="admin-overview-icon inactive">
                <FaExclamationCircle />
              </div>

              <div>
                <span>Inactive Kitchens</span>
                <strong>{inactiveKitchens}</strong>
              </div>
            </motion.div>
          </section>

          <motion.section
            className="admin-kitchens-toolbar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="admin-search-box">
              <FaSearch />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by kitchen name, location or email..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="admin-result-count">
              Showing <strong>{filteredKitchens.length}</strong> of{" "}
              <strong>{kitchens.length}</strong> kitchens
            </div>
          </motion.section>

          {filteredKitchens.length === 0 ? (
            <motion.section
              className="admin-kitchens-empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="admin-empty-icon">
                <FaStore />
              </div>

              <h2>
                {kitchens.length === 0
                  ? "No kitchens found"
                  : "No matching kitchens"}
              </h2>

              <p>
                {kitchens.length === 0
                  ? "Kitchens registered through the platform will appear here."
                  : "Try searching with a different kitchen name or location."}
              </p>

              {search && (
                <button
                  type="button"
                  className="admin-clear-search"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              )}
            </motion.section>
          ) : (
            <motion.section className="admin-kitchen-grid" layout>
              <AnimatePresence mode="popLayout">
                {filteredKitchens.map((kitchen, index) => {
                  const name = getKitchenName(kitchen);
                  const initial = name.charAt(0).toUpperCase();

                  const isActive =
                    kitchen.isActive !== false && kitchen.status !== "inactive";

                  const mealCount =
                    kitchen.mealsCount ??
                    kitchen.totalMeals ??
                    kitchen.meals?.length ??
                    0;

                  return (
                    <motion.article
                      className="admin-kitchen-card"
                      key={kitchen._id || index}
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
                        duration: 0.35,
                        delay: Math.min(index * 0.045, 0.3),
                      }}
                      whileHover={{
                        y: -8,
                      }}
                    >
                      <div className="kitchen-card-glow" />

                      <div className="kitchen-card-top">
                        <motion.div
                          className="kitchen-avatar"
                          whileHover={{
                            scale: 1.08,
                            rotate: -5,
                          }}
                        >
                          {kitchen.image || kitchen.imageUrl ? (
                            <img
                              src={kitchen.image || kitchen.imageUrl}
                              alt={name}
                            />
                          ) : (
                            initial
                          )}
                        </motion.div>

                        <span
                          className={`kitchen-status ${
                            isActive ? "active" : "inactive"
                          }`}
                        >
                          <span />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="kitchen-card-content">
                        <h2>{name}</h2>

                        <span className="kitchen-role">MealCart Kitchen</span>

                        <div className="kitchen-info-list">
                          <div>
                            <FaMapMarkerAlt />
                            <span>{getKitchenLocation(kitchen)}</span>
                          </div>

                          <div>
                            <FaUtensils />
                            <span>
                              {mealCount} {mealCount === 1 ? "meal" : "meals"}
                            </span>
                          </div>

                          <div>
                            <FaCalendarAlt />
                            <span>Joined {formatDate(kitchen.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="kitchen-card-footer">
                        <div className="kitchen-id">
                          <span>Kitchen ID</span>

                          <strong>
                            {kitchen._id
                              ? `${kitchen._id.slice(0, 8)}...`
                              : "—"}
                          </strong>
                        </div>

                        <div className="kitchen-status-icon">
                          <FaStore />
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.section>
          )}

          <motion.div
            className="admin-kitchens-footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span>Live data from your MealCart backend</span>

            <div>
              <span className="live-dot" />
              Synced
            </div>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </>
  );
};

export default AdminKitchens;
