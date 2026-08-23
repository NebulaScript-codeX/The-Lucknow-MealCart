import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaUtensils,
  FaCalendarAlt,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaInbox,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import "./Mysubscriptions.css";

const STATUS_META = {
  active: { label: "Active", cls: "is-active" },
  paused: { label: "Paused", cls: "is-paused" },
  cancelled: { label: "Cancelled", cls: "is-cancelled" },
  expired: { label: "Expired", cls: "is-cancelled" },
};

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const MySubscriptions = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [pendingId, setPendingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | cancelled

  // =====================================
  // FETCH: my subscriptions
  // =====================================

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/plan/my-subscriptions");

      if (res.data.success) {
        setSubscriptions(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        toast.error(res.data.message || "Unable to load your subscriptions.");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Unable to load your subscriptions.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // =====================================
  // CANCEL
  // =====================================

  const cancelSubscription = async (subscriptionId) => {
    const confirmed = window.confirm(
      "Cancel this subscription? This can't be undone.",
    );
    if (!confirmed) return;

    try {
      setPendingId(subscriptionId);

      const res = await axiosInstance.delete(`/plan/cancel/${subscriptionId}`);

      if (res.data.success) {
        toast.success("Subscription cancelled.");
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub._id === subscriptionId ? { ...sub, status: "cancelled" } : sub,
          ),
        );
      } else {
        toast.error(res.data.message || "Unable to cancel.");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to cancel.");
    } finally {
      setPendingId(null);
    }
  };

  const filteredSubs = useMemo(() => {
    if (filter === "all") return subscriptions;
    if (filter === "active")
      return subscriptions.filter((s) => s.status === "active");
    return subscriptions.filter(
      (s) => s.status === "cancelled" || s.status === "expired",
    );
  }, [subscriptions, filter]);

  const activeCount = subscriptions.filter((s) => s.status === "active").length;

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="msubs-page">
          <div className="msubs-container">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-subtitle" />
            <div className="msubs-grid">
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // =====================================
  // EMPTY STATE
  // =====================================

  if (subscriptions.length === 0) {
    return (
      <>
        <Navbar />
        <section className="msubs-empty">
          <div className="msubs-empty-box">
            <FaInbox className="msubs-empty-icon" />
            <h1>No subscriptions yet</h1>
            <p>Pick a kitchen and start your first plan.</p>
            <Link to="/subscriptions" className="msubs-browse-btn">
              Browse plans
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <>
      <Navbar />

      <motion.div
        className="msubs-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="msubs-container">
          <div className="msubs-top">
            <div>
              <h1>My Subscriptions</h1>
              <span className="msubs-subheading">
                {subscriptions.length}{" "}
                {subscriptions.length === 1 ? "subscription" : "subscriptions"}{" "}
                · {activeCount} active
              </span>
            </div>

            <div className="msubs-filters">
              {["all", "active", "cancelled"].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`msubs-filter-btn ${filter === f ? "is-on" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : f === "active" ? "Active" : "Past"}
                </button>
              ))}
            </div>
          </div>

          {filteredSubs.length === 0 ? (
            <p className="msubs-nomatch">No subscriptions in this filter.</p>
          ) : (
            <div className="msubs-grid">
              {filteredSubs.map((sub, index) => {
                const plan = typeof sub.planId === "object" ? sub.planId : null;
                const kitchen =
                  plan && typeof plan.kitchenId === "object"
                    ? plan.kitchenId
                    : null;

                const meta = STATUS_META[sub.status] || STATUS_META.active;
                const isPending = pendingId === sub._id;

                return (
                  <motion.div
                    className={`subscription-card ${meta.cls}`}
                    key={sub._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <span className={`status-badge ${meta.cls}`}>
                      {sub.status === "active" && <FaCheckCircle />}
                      {meta.label}
                    </span>

                    <div className="subscription-card-head">
                      <div className="subscription-icon">
                        <FaUtensils />
                      </div>
                      <div>
                        <h3>{plan?.title || "Meal plan"}</h3>
                        {kitchen && (
                          <Link
                            to={`/kitchen/${kitchen._id}`}
                            className="subscription-kitchen-link"
                          >
                            {kitchen.kitchenName}
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="subscription-meta">
                      <span>
                        <FaCalendarAlt /> Next:{" "}
                        {formatDate(sub.nextDeliveryDate)}
                      </span>
                      <span>
                        <FaBoxOpen /> {sub.mealsLeft ?? "—"} of{" "}
                        {plan?.totalMeals ?? "—"} meals left
                      </span>
                    </div>

                    <div className="subscription-progress">
                      <div
                        className="subscription-progress-fill"
                        style={{
                          width: plan?.totalMeals
                            ? `${Math.min(
                                100,
                                (1 - sub.mealsLeft / plan.totalMeals) * 100,
                              )}%`
                            : "0%",
                        }}
                      />
                    </div>

                    <div className="subscription-price-row">
                      <span className="subscription-price">
                        ₹{plan?.price ?? "—"}
                      </span>
                      <span className="subscription-price-unit">
                        <FaClock /> since {formatDate(sub.createdAt)}
                      </span>
                    </div>

                    {sub.status === "active" && (
                      <button
                        type="button"
                        className="cancel-btn"
                        disabled={isPending}
                        onClick={() => cancelSubscription(sub._id)}
                      >
                        {isPending ? (
                          "Please wait…"
                        ) : (
                          <>
                            <FaBan /> Cancel Subscription
                          </>
                        )}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default MySubscriptions;
