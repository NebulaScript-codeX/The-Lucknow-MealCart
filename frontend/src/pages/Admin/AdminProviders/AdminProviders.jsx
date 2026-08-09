import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaUsers,
  FaUserCheck,
  FaSyncAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaTimes,
  FaUserCircle,
  FaStore,
} from "react-icons/fa";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./AdminProviders.css";

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

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProviders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axiosInstance.get("/admin/providers");

      if (response.data?.success) {
        setProviders(
          Array.isArray(response.data.data) ? response.data.data : [],
        );
      } else {
        toast.error(response.data?.message || "Unable to load providers.");
      }
    } catch (error) {
      console.error("Admin Providers Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load provider data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return providers;

    return providers.filter((provider) => {
      const name = provider.name || "";
      const email = provider.email || "";
      const phone = String(provider.contactNumber || provider.phone || "");

      return (
        name.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword) ||
        phone.toLowerCase().includes(keyword)
      );
    });
  }, [providers, search]);

  const activeProviders = useMemo(() => {
    return providers.filter(
      (provider) =>
        provider.isActive !== false && provider.status !== "inactive",
    ).length;
  }, [providers]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="admin-providers-page">
          <div className="admin-providers-container">
            <div className="admin-providers-loading">
              <div className="admin-skeleton admin-skeleton-title" />
              <div className="admin-skeleton admin-skeleton-subtitle" />

              <div className="admin-provider-stat-skeletons">
                {[1, 2].map((item) => (
                  <div className="admin-provider-stat-skeleton" key={item}>
                    <div className="admin-skeleton admin-skeleton-circle" />

                    <div>
                      <div className="admin-skeleton admin-skeleton-number" />
                      <div className="admin-skeleton admin-skeleton-text" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-skeleton admin-skeleton-search" />

              <div className="admin-provider-grid-skeleton">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div className="admin-provider-card-skeleton" key={item}>
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
        className="admin-providers-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-providers-container">
          <motion.div
            className="admin-providers-topbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="admin-providers-heading">
              <Link to="/admin/dashboard" className="admin-back-button">
                <FaArrowLeft />
                Dashboard
              </Link>

              <span className="admin-page-kicker">ADMIN MANAGEMENT</span>

              <h1>Providers</h1>

              <p>Manage and monitor every provider registered on MealCart.</p>
            </div>

            <motion.button
              type="button"
              className="admin-refresh-button"
              onClick={() => fetchProviders(true)}
              disabled={refreshing}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <FaSyncAlt className={refreshing ? "spinning" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
          </motion.div>

          <section className="admin-provider-overview">
            <motion.div
              className="admin-provider-overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="admin-overview-icon">
                <FaUsers />
              </div>

              <div>
                <span>Total Providers</span>
                <strong>{providers.length}</strong>
              </div>
            </motion.div>

            <motion.div
              className="admin-provider-overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -6 }}
            >
              <div className="admin-overview-icon active">
                <FaUserCheck />
              </div>

              <div>
                <span>Active Providers</span>
                <strong>{activeProviders}</strong>
              </div>
            </motion.div>
          </section>

          <motion.section
            className="admin-providers-toolbar"
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
                placeholder="Search by name, email or phone..."
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
              Showing <strong>{filteredProviders.length}</strong> of{" "}
              <strong>{providers.length}</strong> providers
            </div>
          </motion.section>

          {filteredProviders.length === 0 ? (
            <motion.section
              className="admin-providers-empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="admin-empty-icon">
                <FaUserCircle />
              </div>

              <h2>
                {providers.length === 0
                  ? "No providers found"
                  : "No matching providers"}
              </h2>

              <p>
                {providers.length === 0
                  ? "Providers registered through the platform will appear here."
                  : "Try searching with a different name, email or phone number."}
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
            <motion.section className="admin-provider-grid" layout>
              <AnimatePresence mode="popLayout">
                {filteredProviders.map((provider, index) => {
                  const name = provider.name || "Unnamed Provider";
                  const initial = name.charAt(0).toUpperCase();

                  const phone =
                    provider.contactNumber || provider.phone || null;

                  const isInactive =
                    provider.isActive === false ||
                    provider.status === "inactive";

                  return (
                    <motion.article
                      className="admin-provider-card"
                      key={provider._id}
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
                      <div className="provider-card-glow" />

                      <div className="provider-card-top">
                        <motion.div
                          className="provider-avatar"
                          whileHover={{
                            scale: 1.08,
                            rotate: -5,
                          }}
                        >
                          {provider.profileImage ? (
                            <img src={provider.profileImage} alt={name} />
                          ) : (
                            initial
                          )}
                        </motion.div>

                        <span
                          className={`provider-status ${
                            isInactive ? "inactive" : "active"
                          }`}
                        >
                          <span />
                          {isInactive ? "Inactive" : "Active"}
                        </span>
                      </div>

                      <div className="provider-card-content">
                        <h2>{name}</h2>

                        <span className="provider-role">MealCart Provider</span>

                        <div className="provider-contact-list">
                          <div>
                            <FaEnvelope />
                            <span>
                              {provider.email || "No email available"}
                            </span>
                          </div>

                          <div>
                            <FaPhone />
                            <span>
                              {phone ? String(phone) : "No phone available"}
                            </span>
                          </div>

                          <div>
                            <FaCalendarAlt />
                            <span>Joined {formatDate(provider.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="provider-card-footer">
                        <div className="provider-id">
                          <span>Provider ID</span>

                          <strong>
                            {provider._id
                              ? `${provider._id.slice(0, 8)}...`
                              : "—"}
                          </strong>
                        </div>

                        <motion.div
                          className="provider-type-icon"
                          whileHover={{
                            scale: 1.08,
                            rotate: -5,
                          }}
                        >
                          <FaStore />
                        </motion.div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.section>
          )}

          <motion.div
            className="admin-providers-footer"
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

export default AdminProviders;
