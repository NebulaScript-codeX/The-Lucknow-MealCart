import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiUsers,
  FiPackage,
  FiRefreshCw,
  FiLayers,
} from "react-icons/fi";

import axiosInstance from "../../../utils/axiosInstance";
import "./ProviderPlans.css";

const initialForm = {
  title: "",
  description: "",
  price: "",
  duration: "weekly",
  mealsPerDay: "",
  totalMeals: "",
  isActive: true,
};

const ProviderPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  // =========================
  // FETCH PROVIDER PLANS
  // =========================
  const fetchPlans = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/plan/my-plans");

      if (res.data?.success) {
        setPlans(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Unable to fetch plans.");
      }
    } catch (error) {
      console.error("Fetch plans error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load subscription plans.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // =========================
  // FORM HANDLERS
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingPlan(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);

    setFormData({
      title: plan.title || "",
      description: plan.description || "",
      price: plan.price ?? "",
      duration: plan.duration || "weekly",
      mealsPerDay: plan.mealsPerDay ?? "",
      totalMeals: plan.totalMeals ?? "",
      isActive: plan.isActive !== false,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    resetForm();
  };

  // =========================
  // VALIDATION
  // =========================
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter plan title.");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter plan description.");
      return false;
    }

    if (
      formData.price === "" ||
      Number.isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      toast.error("Please enter a valid plan price.");
      return false;
    }

    if (
      formData.mealsPerDay === "" ||
      Number.isNaN(Number(formData.mealsPerDay)) ||
      Number(formData.mealsPerDay) <= 0
    ) {
      toast.error("Meals per day must be greater than 0.");
      return false;
    }

    if (
      formData.totalMeals === "" ||
      Number.isNaN(Number(formData.totalMeals)) ||
      Number(formData.totalMeals) <= 0
    ) {
      toast.error("Total meals must be greater than 0.");
      return false;
    }

    return true;
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      duration: formData.duration,
      mealsPerDay: Number(formData.mealsPerDay),
      totalMeals: Number(formData.totalMeals),
      isActive: formData.isActive,
    };

    try {
      setSubmitting(true);

      if (editingPlan) {
        const res = await axiosInstance.put(
          `/plan/update/${editingPlan._id}`,
          payload,
        );

        if (!res.data?.success) {
          throw new Error(
            res.data?.message || "Unable to update subscription plan.",
          );
        }

        toast.success("Plan updated successfully.");
      } else {
        const res = await axiosInstance.post("/plan/create", payload);

        if (!res.data?.success) {
          throw new Error(
            res.data?.message || "Unable to create subscription plan.",
          );
        }

        toast.success("Plan created successfully.");
      }

      setShowModal(false);
      resetForm();

      await fetchPlans();
    } catch (error) {
      console.error("Plan save error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (planId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plan?",
    );

    if (!confirmed) return;

    try {
      const res = await axiosInstance.delete(`/plan/delete/${planId}`);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Unable to delete plan.");
      }

      toast.success("Plan deleted successfully.");

      setPlans((prev) => prev.filter((plan) => plan._id !== planId));
    } catch (error) {
      console.error("Delete plan error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete plan.",
      );
    }
  };

  // =========================
  // HELPERS
  // =========================
  const getDurationLabel = (duration) => {
    return duration === "monthly" ? "Monthly" : "Weekly";
  };

  const getDurationDays = (duration) => {
    return duration === "monthly" ? "30 days" : "7 days";
  };

  const activePlans = plans.filter((plan) => plan.isActive).length;

  const totalMeals = plans.reduce(
    (sum, plan) => sum + Number(plan.totalMeals || 0),
    0,
  );

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="provider-plans-page">
        <div className="plans-loading">
          <div className="plans-loader-icon">
            <FiRefreshCw />
          </div>

          <h3>Loading your plans...</h3>
          <p>Fetching your subscription plans from the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-plans-page">
      {/* ================= HEADER ================= */}
      <motion.section
        className="plans-page-header"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="plans-header-content">
          <div className="plans-eyebrow">
            <span className="eyebrow-dot" />
            PROVIDER WORKSPACE
          </div>

          <h1>
            Manage your <span>subscription plans.</span>
          </h1>

          <p>
            Create and manage weekly or monthly meal plans for your kitchen
            directly from one place.
          </p>
        </div>

        <motion.button
          className="create-plan-btn"
          onClick={openCreateModal}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiPlus />
          Create New Plan
        </motion.button>
      </motion.section>

      {/* ================= STATS ================= */}
      <motion.section
        className="plans-stats-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        <motion.div
          className="plan-stat-card"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon orange">
            <FiLayers />
          </div>

          <div>
            <span>Total Plans</span>
            <strong>{plans.length}</strong>
          </div>
        </motion.div>

        <motion.div
          className="plan-stat-card"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon green">
            <FiCheckCircle />
          </div>

          <div>
            <span>Active Plans</span>
            <strong>{activePlans}</strong>
          </div>
        </motion.div>

        <motion.div
          className="plan-stat-card"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon blue">
            <FiPackage />
          </div>

          <div>
            <span>Total Meals</span>
            <strong>{totalMeals}</strong>
          </div>
        </motion.div>
      </motion.section>

      {/* ================= PLANS ================= */}
      <section className="plans-section">
        <div className="plans-section-heading">
          <div>
            <span>YOUR PLANS</span>
            <h2>Subscription plans</h2>
          </div>

          <button
            className="refresh-plans-btn"
            onClick={fetchPlans}
            title="Refresh plans"
          >
            <FiRefreshCw />
          </button>
        </div>

        {plans.length === 0 ? (
          <motion.div
            className="plans-empty-state"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-plan-icon">
              <FiLayers />
            </div>

            <h3>No subscription plans yet</h3>

            <p>
              Create your first weekly or monthly meal plan and start offering
              subscriptions to customers.
            </p>

            <button onClick={openCreateModal}>
              <FiPlus />
              Create Your First Plan
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="plans-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {plans.map((plan) => (
              <motion.article
                key={plan._id}
                className={`subscription-plan-card ${
                  !plan.isActive ? "inactive-plan" : ""
                }`}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 25,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                whileHover={{
                  y: -7,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="plan-card-top">
                  <div className="plan-duration-badge">
                    <FiClock />
                    {getDurationLabel(plan.duration)}
                  </div>

                  <span
                    className={`plan-status ${
                      plan.isActive ? "active" : "inactive"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="plan-title-area">
                  <h3>{plan.title}</h3>

                  <p>{plan.description}</p>
                </div>

                <div className="plan-price">
                  <span>₹</span>
                  {Number(plan.price).toLocaleString("en-IN")}
                  <small>
                    /{plan.duration === "monthly" ? "month" : "week"}
                  </small>
                </div>

                <div className="plan-info-grid">
                  <div className="plan-info-item">
                    <div className="plan-info-icon">
                      <FiUsers />
                    </div>

                    <div>
                      <strong>{plan.mealsPerDay}</strong>
                      <span>Meals / day</span>
                    </div>
                  </div>

                  <div className="plan-info-item">
                    <div className="plan-info-icon">
                      <FiPackage />
                    </div>

                    <div>
                      <strong>{plan.totalMeals}</strong>
                      <span>Total meals</span>
                    </div>
                  </div>

                  <div className="plan-info-item">
                    <div className="plan-info-icon">
                      <FiCalendar />
                    </div>

                    <div>
                      <strong>{getDurationDays(plan.duration)}</strong>
                      <span>Duration</span>
                    </div>
                  </div>
                </div>

                <div className="plan-card-divider" />

                <div className="plan-card-actions">
                  <button
                    className="plan-edit-btn"
                    onClick={() => openEditModal(plan)}
                  >
                    <FiEdit3 />
                    Edit
                  </button>

                  <button
                    className="plan-delete-btn"
                    onClick={() => handleDelete(plan._id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="plan-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              className="plan-modal"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="plan-modal-header">
                <div>
                  <span>
                    {editingPlan ? "UPDATE PLAN" : "NEW SUBSCRIPTION"}
                  </span>

                  <h2>{editingPlan ? "Edit your plan" : "Create a plan"}</h2>
                </div>

                <button
                  className="modal-close-btn"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  <FiX />
                </button>
              </div>

              <form className="plan-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    Plan Title <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Ghar Ka Khana Weekly"
                    maxLength={80}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Description <span>*</span>
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what customers will receive in this plan..."
                    rows="4"
                    maxLength={500}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Price <span>*</span>
                    </label>

                    <div className="input-with-prefix">
                      <span>₹</span>

                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="999"
                        min="1"
                        step="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Duration <span>*</span>
                    </label>

                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Meals Per Day <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="mealsPerDay"
                      value={formData.mealsPerDay}
                      onChange={handleChange}
                      placeholder="2"
                      min="1"
                      step="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Total Meals <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="totalMeals"
                      value={formData.totalMeals}
                      onChange={handleChange}
                      placeholder="14"
                      min="1"
                      step="1"
                      required
                    />
                  </div>
                </div>

                <label className="active-plan-toggle">
                  <div className="toggle-text">
                    <strong>Plan availability</strong>
                    <span>
                      {formData.isActive
                        ? "Customers can subscribe to this plan."
                        : "This plan will be hidden from active plans."}
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />

                  <span className="custom-toggle" />
                </label>

                <div className="plan-form-actions">
                  <button
                    type="button"
                    className="cancel-form-btn"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-plan-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="button-spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingPlan ? <FiEdit3 /> : <FiPlus />}
                        {editingPlan ? "Update Plan" : "Create Plan"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderPlans;
