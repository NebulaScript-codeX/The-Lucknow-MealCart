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
} from "react-icons/fa";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";

import "./AdminCustomers.css";

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

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axiosInstance.get("/admin/customers");

      if (response.data?.success) {
        setCustomers(
          Array.isArray(response.data.data) ? response.data.data : [],
        );
      } else {
        toast.error(response.data?.message || "Unable to load customers.");
      }
    } catch (error) {
      console.error("Admin Customers Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to load customer data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return customers;

    return customers.filter((customer) => {
      const name = customer.name || "";
      const email = customer.email || "";
      const phone = customer.phone || "";

      return (
        name.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword) ||
        phone.toLowerCase().includes(keyword)
      );
    });
  }, [customers, search]);

  const activeCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.isActive !== false && customer.status !== "inactive",
    ).length;
  }, [customers]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="admin-customers-page">
          <div className="admin-customers-container">
            <div className="admin-customers-loading">
              <div className="admin-skeleton admin-skeleton-title" />
              <div className="admin-skeleton admin-skeleton-subtitle" />

              <div className="admin-customer-stat-skeletons">
                {[1, 2].map((item) => (
                  <div className="admin-customer-stat-skeleton" key={item}>
                    <div className="admin-skeleton admin-skeleton-circle" />
                    <div>
                      <div className="admin-skeleton admin-skeleton-number" />
                      <div className="admin-skeleton admin-skeleton-text" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-skeleton admin-skeleton-search" />

              <div className="admin-customer-grid-skeleton">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div className="admin-customer-card-skeleton" key={item}>
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
        className="admin-customers-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-customers-container">
          <motion.div
            className="admin-customers-topbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="admin-customers-heading">
              <Link to="/admin/dashboard" className="admin-back-button">
                <FaArrowLeft />
                Dashboard
              </Link>

              <span className="admin-page-kicker">ADMIN MANAGEMENT</span>

              <h1>Customers</h1>

              <p>Manage and monitor every customer registered on MealCart.</p>
            </div>

            <motion.button
              type="button"
              className="admin-refresh-button"
              onClick={() => fetchCustomers(true)}
              disabled={refreshing}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <FaSyncAlt className={refreshing ? "spinning" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
          </motion.div>

          <section className="admin-customer-overview">
            <motion.div
              className="admin-customer-overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="admin-overview-icon">
                <FaUsers />
              </div>

              <div>
                <span>Total Customers</span>
                <strong>{customers.length}</strong>
              </div>
            </motion.div>

            <motion.div
              className="admin-customer-overview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -6 }}
            >
              <div className="admin-overview-icon active">
                <FaUserCheck />
              </div>

              <div>
                <span>Active Customers</span>
                <strong>{activeCustomers}</strong>
              </div>
            </motion.div>
          </section>

          <motion.section
            className="admin-customers-toolbar"
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
              Showing <strong>{filteredCustomers.length}</strong> of{" "}
              <strong>{customers.length}</strong> customers
            </div>
          </motion.section>

          {filteredCustomers.length === 0 ? (
            <motion.section
              className="admin-customers-empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="admin-empty-icon">
                <FaUserCircle />
              </div>

              <h2>
                {customers.length === 0
                  ? "No customers found"
                  : "No matching customers"}
              </h2>

              <p>
                {customers.length === 0
                  ? "Customers registered through the platform will appear here."
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
            <motion.section className="admin-customer-grid" layout>
              <AnimatePresence mode="popLayout">
                {filteredCustomers.map((customer, index) => {
                  const name = customer.name || "Unnamed Customer";
                  const initial = name.charAt(0).toUpperCase();

                  return (
                    <motion.article
                      className="admin-customer-card"
                      key={customer._id}
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
                      <div className="customer-card-glow" />

                      <div className="customer-card-top">
                        <motion.div
                          className="customer-avatar"
                          whileHover={{
                            scale: 1.08,
                            rotate: -5,
                          }}
                        >
                          {customer.profileImage ? (
                            <img src={customer.profileImage} alt={name} />
                          ) : (
                            initial
                          )}
                        </motion.div>

                        <span
                          className={`customer-status ${
                            customer.isActive === false ||
                            customer.status === "inactive"
                              ? "inactive"
                              : "active"
                          }`}
                        >
                          <span />
                          {customer.isActive === false ||
                          customer.status === "inactive"
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </div>

                      <div className="customer-card-content">
                        <h2>{name}</h2>

                        <span className="customer-role">MealCart Customer</span>

                        <div className="customer-contact-list">
                          <div>
                            <FaEnvelope />
                            <span>
                              {customer.email || "No email available"}
                            </span>
                          </div>

                          <div>
                            <FaPhone />
                            <span>
                              {customer.phone || "No phone available"}
                            </span>
                          </div>

                          <div>
                            <FaCalendarAlt />
                            <span>Joined {formatDate(customer.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="customer-card-footer">
                        <div className="customer-id">
                          <span>Customer ID</span>
                          <strong>
                            {customer._id
                              ? `${customer._id.slice(0, 8)}...`
                              : "—"}
                          </strong>
                        </div>

                        <motion.button
                          type="button"
                          className="customer-view-button"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                        >
                          <FaArrowRight />
                        </motion.button>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.section>
          )}

          <motion.div
            className="admin-customers-footer"
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

export default AdminCustomers;
