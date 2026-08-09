import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaUtensils,
  FaCalendarAlt,
  FaBoxOpen,
  FaCheckCircle,
  FaStore,
  FaBan,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import "./Subscriptions.css";

const Subscriptions = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [pendingId, setPendingId] = useState(null);

  // =====================================
  // FETCH: all plans + my active subscriptions
  // =====================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [plansRes, subsRes] = await Promise.all([
        axiosInstance.get("/plan/all"),
        axiosInstance.get("/plan/my-subscriptions"),
      ]);

      let planList = [];
      if (plansRes.data.success) {
        planList = Array.isArray(plansRes.data.data) ? plansRes.data.data : [];
      }

      let subs = [];
      if (subsRes.data.success) {
        subs = Array.isArray(subsRes.data.data) ? subsRes.data.data : [];
      }

      setPlans(planList);
      setMySubscriptions(subs);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to load plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map planId -> active subscription (if any), so we know which
  // plans the customer is currently subscribed to.
  const activeSubByPlanId = useMemo(() => {
    const map = new Map();

    mySubscriptions.forEach((sub) => {
      const planId =
        typeof sub.planId === "object" ? sub.planId?._id : sub.planId;

      if (planId && sub.status === "active") {
        map.set(planId, sub);
      }
    });

    return map;
  }, [mySubscriptions]);

  // =====================================
  // SUBSCRIBE / CANCEL
  // =====================================

  const subscribeToPlan = async (planId) => {
    try {
      setPendingId(planId);

      const res = await axiosInstance.post(`/plan/subscribe/${planId}`);

      if (res.data.success) {
        toast.success("Subscribed successfully!");
        await fetchData();
      } else {
        toast.error(res.data.message || "Unable to subscribe.");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to subscribe.");
    } finally {
      setPendingId(null);
    }
  };

  const cancelSubscription = async (subscriptionId, planId) => {
    try {
      setPendingId(planId);

      const res = await axiosInstance.delete(`/plan/cancel/${subscriptionId}`);

      if (res.data.success) {
        toast.success("Subscription cancelled.");
        await fetchData();
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

  const activeCount = activeSubByPlanId.size;

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="subs-page">
          <div className="subs-container">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-subtitle" />
            <div className="subs-grid">
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
  // EMPTY STATE (no plans created by any kitchen yet)
  // =====================================

  if (plans.length === 0) {
    return (
      <>
        <Navbar />
        <section className="subs-empty">
          <div className="subs-empty-box">
            <FaStore className="subs-empty-icon" />
            <h1>No Plans Available</h1>
            <p>Kitchens haven't listed any subscription plans yet.</p>
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
        className="subs-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="subs-container">
          <div className="subs-top">
            <h1>Buy Subscriptions</h1>
            <span className="subs-subheading">
              {plans.length} {plans.length === 1 ? "plan" : "plans"} available ·
              you have {activeCount} active
            </span>
          </div>

          <div className="subs-grid">
            {plans.map((plan, index) => {
              const kitchen =
                typeof plan.kitchenId === "object" ? plan.kitchenId : null;

              const activeSub = activeSubByPlanId.get(plan._id);
              const isPending = pendingId === plan._id;

              return (
                <motion.div
                  className={`plan-card ${activeSub ? "is-subscribed" : ""}`}
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  {activeSub && (
                    <span className="subscribed-badge">
                      <FaCheckCircle />
                      Active
                    </span>
                  )}

                  <div className="plan-card-head">
                    <div className="plan-icon">
                      <FaUtensils />
                    </div>
                    <div>
                      <h3>{plan.title}</h3>
                      {kitchen && (
                        <Link
                          to={`/kitchen/${kitchen._id}`}
                          className="plan-kitchen-link"
                        >
                          {kitchen.kitchenName}
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="plan-desc">{plan.description}</p>

                  <div className="plan-meta">
                    <span>
                      <FaCalendarAlt /> {plan.duration}
                    </span>
                    <span>
                      <FaBoxOpen /> {plan.mealsPerDay} meals/day
                    </span>
                  </div>

                  <div className="plan-total-meals">
                    {plan.totalMeals} total meals in this plan
                  </div>

                  <div className="plan-price-row">
                    <span className="plan-price">₹{plan.price}</span>
                    <span className="plan-price-unit">
                      / {plan.duration === "weekly" ? "week" : "month"}
                    </span>
                  </div>

                  {activeSub ? (
                    <button
                      type="button"
                      className="subscribe-btn is-subscribed"
                      disabled={isPending}
                      onClick={() =>
                        cancelSubscription(activeSub._id, plan._id)
                      }
                    >
                      {isPending ? (
                        "Please wait…"
                      ) : (
                        <>
                          <FaBan /> Cancel Subscription
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="subscribe-btn"
                      disabled={isPending}
                      onClick={() => subscribeToPlan(plan._id)}
                    >
                      {isPending ? "Please wait…" : "Subscribe"}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default Subscriptions;
