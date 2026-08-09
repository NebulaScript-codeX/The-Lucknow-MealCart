import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiImage,
  FiDollarSign,
  FiLayers,
  FiEye,
  FiEyeOff,
  FiUploadCloud,
  FiShoppingBag,
} from "react-icons/fi";

import axiosInstance from "../../../utils/axiosInstance";
import "./ProviderMeals.css";

// =========================================================
// INITIAL FORM
// =========================================================

const initialForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  mealType: "",
  vegOrNonVeg: "",
  quantityAvailable: "",
  isAvailable: true,
};

// =========================================================
// CATEGORIES
// =========================================================

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Beverages",
  "Dessert",
  "Thali",
  "Combo",
  "Other",
];

// =========================================================
// MEAL TYPES
// =========================================================

const mealTypes = [
  {
    value: "breakfast",
    label: "Breakfast",
  },
  {
    value: "lunch",
    label: "Lunch",
  },
  {
    value: "dinner",
    label: "Dinner",
  },
];

// =========================================================
// COMPONENT
// =========================================================

const ProviderMeal = () => {
  const [meals, setMeals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const normalized = image.replace(/\\/g, "/");

    return `http://localhost:4000/${normalized}`;
  };

  // =========================================================
  // AVAILABILITY
  // =========================================================

  const getMealAvailability = (meal) => {
    if (!meal) return false;

    return meal.isAvailable !== false;
  };

  // =========================================================
  // FETCH MEALS
  // =========================================================

  const fetchMeals = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/meal/my-meals");

      if (res.data?.success) {
        setMeals(
          Array.isArray(res.data.data)
            ? res.data.data.filter(Boolean)
            : [],
        );
      } else {
        toast.error(
          res.data?.message || "Unable to fetch your meals.",
        );
      }
    } catch (error) {
      console.error("Fetch meals error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load your meals.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setFormData(initialForm);
    setEditingMeal(null);
    setImageFile(null);
    setImagePreview("");
  };

  // =========================================================
  // OPEN CREATE
  // =========================================================

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEditModal = (meal) => {
    if (!meal) return;

    setEditingMeal(meal);

    setFormData({
      title: meal.title || "",
      description: meal.description || "",
      price: meal.price ?? "",
      category: meal.category || "",
      mealType: meal.mealType || "",
      vegOrNonVeg: meal.vegOrNonVeg || "",
      quantityAvailable: meal.quantityAvailable ?? "",
      isAvailable: meal.isAvailable !== false,
    });

    setImageFile(null);

    if (meal.image) {
      setImagePreview(getImageUrl(meal.image));
    } else {
      setImagePreview("");
    }

    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    resetForm();
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    // Title
    if (!formData.title.trim()) {
      toast.error("Please enter meal name.");
      return false;
    }

    // Description
    if (!formData.description.trim()) {
      toast.error("Please enter meal description.");
      return false;
    }

    // Price
    if (
      formData.price === "" ||
      Number.isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      toast.error("Please enter a valid meal price.");
      return false;
    }

    // Category
    if (!formData.category) {
      toast.error("Please select a category.");
      return false;
    }

    // Meal Type
    if (!formData.mealType) {
      toast.error("Please select meal type.");
      return false;
    }

    // Veg / Non-Veg
    if (!formData.vegOrNonVeg) {
      toast.error("Please select veg or non-veg.");
      return false;
    }

    // Quantity
    if (
      formData.quantityAvailable === "" ||
      Number.isNaN(Number(formData.quantityAvailable)) ||
      Number(formData.quantityAvailable) < 1
    ) {
      toast.error("Please enter available quantity.");
      return false;
    }

    // Image is required only while creating.
    // During edit, existing image can remain.
    if (!editingMeal && !imageFile) {
      toast.error("Please upload a meal image.");
      return false;
    }

    return true;
  };

  // =========================================================
  // CREATE / UPDATE MEAL
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = new FormData();

      // Required fields
      payload.append("title", formData.title.trim());

      payload.append(
        "description",
        formData.description.trim(),
      );

      payload.append(
        "price",
        Number(formData.price),
      );

      payload.append(
        "category",
        formData.category,
      );

      payload.append(
        "mealType",
        formData.mealType,
      );

      payload.append(
        "vegOrNonVeg",
        formData.vegOrNonVeg,
      );

      payload.append(
        "quantityAvailable",
        Number(formData.quantityAvailable),
      );

      // Availability
      payload.append(
        "isAvailable",
        formData.isAvailable ? "true" : "false",
      );

      // Image
      if (imageFile) {
        payload.append("image", imageFile);
      }

      let res;

      // =====================================================
      // UPDATE
      // =====================================================

      if (editingMeal) {
        res = await axiosInstance.put(
          `/meal/update-meal/${editingMeal._id}`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (!res.data?.success) {
          throw new Error(
            res.data?.message ||
              "Unable to update meal.",
          );
        }

        toast.success("Meal updated successfully.");
      }

      // =====================================================
      // CREATE
      // =====================================================

      else {
        res = await axiosInstance.post(
          "/meal/add-meal",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (!res.data?.success) {
          throw new Error(
            res.data?.message ||
              "Unable to create meal.",
          );
        }

        toast.success("Meal added successfully.");
      }

      // Close modal
      setShowModal(false);

      // Reset form
      resetForm();

      // Refresh meals
      await fetchMeals();
    } catch (error) {
      console.error("Meal save error:", error);

      console.error(
        "Backend response:",
        error.response?.data,
      );

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Something went wrong while saving the meal.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (mealId) => {
    if (!mealId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this meal?",
    );

    if (!confirmed) return;

    try {
      const res = await axiosInstance.delete(
        `/meal/delete-meal/${mealId}`,
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Unable to delete meal.",
        );
      }

      toast.success("Meal deleted successfully.");

      setMeals((prev) =>
        prev.filter(
          (meal) => meal?._id !== mealId,
        ),
      );
    } catch (error) {
      console.error("Delete meal error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete meal.",
      );
    }
  };

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      if (!meal) return false;

      const title = meal.title || "";
      const description = meal.description || "";
      const category = meal.category || "";

      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        title.toLowerCase().includes(search) ||
        description.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        category.toLowerCase() ===
          categoryFilter.toLowerCase();

      const isAvailable =
        getMealAvailability(meal);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          isAvailable) ||
        (statusFilter === "inactive" &&
          !isAvailable);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    meals,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  // =========================================================
  // STATS
  // =========================================================

  const activeMeals = meals.filter((meal) =>
    getMealAvailability(meal),
  ).length;

  const inactiveMeals = meals.filter(
    (meal) =>
      meal && !getMealAvailability(meal),
  ).length;

  const totalValue = meals.reduce(
    (sum, meal) =>
      sum + Number(meal?.price || 0),
    0,
  );

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="provider-meals-page">
        <div className="provider-meals-container">

          <div className="meal-loading-header">
            <div className="meal-shimmer meal-shimmer-title" />

            <div className="meal-shimmer meal-shimmer-description" />
          </div>

          <div className="meal-loading-stats">
            {[1, 2, 3, 4].map((item) => (
              <div
                className="meal-stat-skeleton"
                key={item}
              >
                <div className="meal-shimmer meal-shimmer-icon" />

                <div>
                  <div className="meal-shimmer meal-shimmer-small" />

                  <div className="meal-shimmer meal-shimmer-number" />
                </div>
              </div>
            ))}
          </div>

          <div className="meal-loading-grid">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  className="meal-card-skeleton"
                  key={item}
                >
                  <div className="meal-shimmer meal-shimmer-image" />

                  <div className="meal-skeleton-content">
                    <div className="meal-shimmer meal-shimmer-line" />

                    <div className="meal-shimmer meal-shimmer-line short" />

                    <div className="meal-shimmer meal-shimmer-line shorter" />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="provider-meals-page">
      <div className="provider-meals-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.section
          className="provider-meals-header"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div className="provider-meals-heading">

            <div className="meals-eyebrow">
              <FiLayers />
              <span>PROVIDER WORKSPACE</span>
            </div>

            <h1>
              Manage your <span>meals.</span>
            </h1>

            <p>
              Create, update and manage the meals
              available from your kitchen.
            </p>
          </div>

          <motion.button
            type="button"
            className="create-meal-btn"
            onClick={openCreateModal}
            whileHover={{
              y: -4,
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <FiPlus />
            Add New Meal
          </motion.button>
        </motion.section>

        {/* =====================================================
            STATS
        ====================================================== */}

        <motion.section
          className="provider-meal-stats"
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

          {/* TOTAL */}

          <motion.div
            className="meal-stat-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            whileHover={{ y: -5 }}
          >
            <div className="meal-stat-icon orange">
              <FiPackage />
            </div>

            <div>
              <span>Total Meals</span>

              <strong>
                {meals.length}
              </strong>
            </div>
          </motion.div>

          {/* AVAILABLE */}

          <motion.div
            className="meal-stat-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            whileHover={{ y: -5 }}
          >
            <div className="meal-stat-icon green">
              <FiCheckCircle />
            </div>

            <div>
              <span>Available</span>

              <strong>
                {activeMeals}
              </strong>
            </div>
          </motion.div>

          {/* UNAVAILABLE */}

          <motion.div
            className="meal-stat-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            whileHover={{ y: -5 }}
          >
            <div className="meal-stat-icon red">
              <FiEyeOff />
            </div>

            <div>
              <span>Unavailable</span>

              <strong>
                {inactiveMeals}
              </strong>
            </div>
          </motion.div>

          {/* VALUE */}

          <motion.div
            className="meal-stat-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            whileHover={{ y: -5 }}
          >
            <div className="meal-stat-icon blue">
              <FiDollarSign />
            </div>

            <div>
              <span>Menu Value</span>

              <strong>
                ₹
                {totalValue.toLocaleString(
                  "en-IN",
                )}
              </strong>
            </div>
          </motion.div>
        </motion.section>

        {/* =====================================================
            FILTER BAR
        ====================================================== */}

        <motion.section
          className="meals-toolbar"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
        >
          <div className="meal-search-box">
            <FiSearch />

            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() =>
                  setSearchTerm("")
                }
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="meal-filter-group">

            {/* CATEGORY */}

            <div className="meal-filter">
              <FiFilter />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value,
                  )
                }
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      value={category}
                      key={category}
                    >
                      {category}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* STATUS */}

            <div className="meal-filter">
              {statusFilter ===
              "inactive" ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value,
                  )
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Available
                </option>

                <option value="inactive">
                  Unavailable
                </option>
              </select>
            </div>

            {/* REFRESH */}

            <motion.button
              type="button"
              className="refresh-meals-btn"
              onClick={fetchMeals}
              title="Refresh meals"
              whileHover={{
                rotate: 12,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <FiRefreshCw />
            </motion.button>
          </div>
        </motion.section>

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="meals-section-heading">
          <div>
            <span>YOUR MENU</span>

            <h2>Kitchen meals</h2>

            <p>
              Showing{" "}
              <strong>
                {filteredMeals.length}
              </strong>{" "}
              of{" "}
              <strong>
                {meals.length}
              </strong>{" "}
              meals
            </p>
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredMeals.length === 0 ? (
          <motion.div
            className="meals-empty-state"
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            <div className="empty-meal-icon">
              {meals.length === 0 ? (
                <FiPackage />
              ) : (
                <FiSearch />
              )}
            </div>

            <h3>
              {meals.length === 0
                ? "No meals yet"
                : "No meals found"}
            </h3>

            <p>
              {meals.length === 0
                ? "Add your first meal and start building your kitchen menu."
                : "Try changing your search or filters."}
            </p>

            {meals.length === 0 && (
              <button
                type="button"
                onClick={openCreateModal}
              >
                <FiPlus />
                Add Your First Meal
              </button>
            )}

            {meals.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                <FiRefreshCw />
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (

          /* =====================================================
             MEAL GRID
          ====================================================== */

          <motion.div
            className="provider-meals-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.07,
                },
              },
            }}
          >
            {filteredMeals.map((meal) => {
              if (!meal) return null;

              const mealTitle =
                meal.title ||
                "Untitled Meal";

              const mealImage = meal.image
                ? getImageUrl(meal.image)
                : "";

              const isAvailable =
                getMealAvailability(meal);

              return (
                <motion.article
                  className={`provider-meal-card ${
                    !isAvailable
                      ? "meal-unavailable"
                      : ""
                  }`}
                  key={meal._id}
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
                    y: -8,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                >

                  {/* IMAGE */}

                  <div className="provider-meal-image">

                    {mealImage ? (
                      <img
                        src={mealImage}
                        alt={mealTitle}
                      />
                    ) : (
                      <div className="meal-no-image">
                        <FiImage />

                        <span>
                          No Image
                        </span>
                      </div>
                    )}

                    <div className="meal-image-overlay" />

                    <span className="meal-category-badge">
                      {meal.category ||
                        "Meal"}
                    </span>

                    <span
                      className={`meal-availability ${
                        isAvailable
                          ? "available"
                          : "unavailable"
                      }`}
                    >
                      {isAvailable ? (
                        <FiCheckCircle />
                      ) : (
                        <FiEyeOff />
                      )}

                      {isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  {/* CONTENT */}

                  <div className="provider-meal-content">

                    <div className="provider-meal-title-row">

                      <h3>
                        {mealTitle}
                      </h3>

                      <div className="meal-price">
                        ₹
                        {Number(
                          meal.price || 0,
                        ).toLocaleString(
                          "en-IN",
                        )}
                      </div>
                    </div>

                    <p className="provider-meal-description">
                      {meal.description ||
                        "No description added for this meal."}
                    </p>

                    {/* META */}

                    <div className="meal-card-meta">

                      <span>
                        <FiClock />

                        {meal.mealType
                          ? meal.mealType
                              .charAt(0)
                              .toUpperCase() +
                            meal.mealType.slice(
                              1,
                            )
                          : "Meal"}
                      </span>

                      <span>
                        {meal.vegOrNonVeg ===
                        "veg" ? (
                          <>
                            <FiCheckCircle />
                            Veg
                          </>
                        ) : (
                          <>
                            <FiShoppingBag />
                            Non-Veg
                          </>
                        )}
                      </span>

                    </div>

                    {/* QUANTITY */}

                    <div className="meal-card-meta">

                      <span>
                        <FiPackage />

                        {Number(
                          meal.quantityAvailable ||
                            0,
                        )}{" "}
                        available
                      </span>

                      <span>
                        {isAvailable ? (
                          <FiCheckCircle />
                        ) : (
                          <FiEyeOff />
                        )}

                        {isAvailable
                          ? "Orderable"
                          : "Hidden"}
                      </span>

                    </div>

                    <div className="meal-card-divider" />

                    {/* ACTIONS */}

                    <div className="provider-meal-actions">

                      <button
                        type="button"
                        className="meal-edit-btn"
                        onClick={() =>
                          openEditModal(meal)
                        }
                      >
                        <FiEdit3 />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="meal-delete-btn"
                        onClick={() =>
                          handleDelete(
                            meal._id,
                          )
                        }
                        title="Delete meal"
                      >
                        <FiTrash2 />
                      </button>

                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* =====================================================
            MODAL
        ====================================================== */}

        <AnimatePresence>
          {showModal && (
            <motion.div
              className="meal-modal-overlay"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onMouseDown={(e) => {
                if (
                  e.target ===
                  e.currentTarget
                ) {
                  closeModal();
                }
              }}
            >
              <motion.div
                className="meal-modal"
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.25,
                }}
              >

                {/* =================================================
                    MODAL HEADER
                ================================================== */}

                <div className="meal-modal-header">

                  <div>
                    <span>
                      {editingMeal
                        ? "UPDATE MEAL"
                        : "NEW MENU ITEM"}
                    </span>

                    <h2>
                      {editingMeal
                        ? "Edit your meal"
                        : "Add a new meal"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="meal-modal-close"
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    <FiX />
                  </button>
                </div>

                {/* =================================================
                    FORM
                ================================================== */}

                <form
                  className="meal-form"
                  onSubmit={handleSubmit}
                >

                  {/* =================================================
                      IMAGE
                  ================================================== */}

                  <div className="meal-image-upload">

                    <div className="upload-preview">

                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Meal preview"
                        />
                      ) : (
                        <div>
                          <FiUploadCloud />

                          <span>
                            Upload meal image
                          </span>
                        </div>
                      )}

                    </div>

                    <label className="upload-btn">
                      <FiImage />

                      {imagePreview
                        ? "Change Image"
                        : "Choose Image"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleImageChange
                        }
                      />
                    </label>

                    <small>
                      JPG, PNG or WEBP • Maximum
                      5MB
                      {!editingMeal &&
                        " • Required"}
                    </small>
                  </div>

                  {/* =================================================
                      TITLE
                  ================================================== */}

                  <div className="form-group">

                    <label>
                      Meal Name{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={
                        formData.title
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Paneer Butter Masala"
                      maxLength={100}
                      required
                    />
                  </div>

                  {/* =================================================
                      DESCRIPTION
                  ================================================== */}

                  <div className="form-group">

                    <label>
                      Description{" "}
                      <span>*</span>
                    </label>

                    <textarea
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Describe ingredients, taste and what customers will receive..."
                      rows="4"
                      maxLength={500}
                      required
                    />
                  </div>

                  {/* =================================================
                      PRICE + CATEGORY
                  ================================================== */}

                  <div className="form-row">

                    {/* PRICE */}

                    <div className="form-group">

                      <label>
                        Price{" "}
                        <span>*</span>
                      </label>

                      <div className="input-prefix">
                        <span>₹</span>

                        <input
                          type="number"
                          name="price"
                          value={
                            formData.price
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="199"
                          min="1"
                          step="1"
                          required
                        />
                      </div>
                    </div>

                    {/* CATEGORY */}

                    <div className="form-group">

                      <label>
                        Category{" "}
                        <span>*</span>
                      </label>

                      <select
                        name="category"
                        value={
                          formData.category
                        }
                        onChange={
                          handleChange
                        }
                        required
                      >
                        <option value="">
                          Select category
                        </option>

                        {categories.map(
                          (category) => (
                            <option
                              value={category}
                              key={category}
                            >
                              {category}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  {/* =================================================
                      MEAL TYPE + FOOD TYPE
                  ================================================== */}

                  <div className="form-row">

                    {/* MEAL TYPE */}

                    <div className="form-group">

                      <label>
                        Meal Type{" "}
                        <span>*</span>
                      </label>

                      <select
                        name="mealType"
                        value={
                          formData.mealType
                        }
                        onChange={
                          handleChange
                        }
                        required
                      >
                        <option value="">
                          Select meal type
                        </option>

                        {mealTypes.map(
                          (type) => (
                            <option
                              value={
                                type.value
                              }
                              key={
                                type.value
                              }
                            >
                              {type.label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    {/* VEG / NON VEG */}

                    <div className="form-group">

                      <label>
                        Food Type{" "}
                        <span>*</span>
                      </label>

                      <select
                        name="vegOrNonVeg"
                        value={
                          formData.vegOrNonVeg
                        }
                        onChange={
                          handleChange
                        }
                        required
                      >
                        <option value="">
                          Select food type
                        </option>

                        <option value="veg">
                          Veg
                        </option>

                        <option value="non-veg">
                          Non-Veg
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* =================================================
                      QUANTITY
                  ================================================== */}

                  <div className="form-group">

                    <label>
                      Available Quantity{" "}
                      <span>*</span>
                    </label>

                    <div className="input-prefix">
                      <span>
                        <FiPackage />
                      </span>

                      <input
                        type="number"
                        name="quantityAvailable"
                        value={
                          formData.quantityAvailable
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="e.g. 20"
                        min="1"
                        step="1"
                        required
                      />
                    </div>

                    <small>
                      Number of portions/items
                      currently available.
                    </small>
                  </div>

                  {/* =================================================
                      AVAILABILITY
                  ================================================== */}

                  <label className="meal-availability-toggle">

                    <div>
                      <strong>
                        Meal availability
                      </strong>

                      <span>
                        {formData.isAvailable
                          ? "Customers can order this meal."
                          : "This meal will be hidden from customers."}
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={
                        formData.isAvailable ===
                        true
                      }
                      onChange={
                        handleChange
                      }
                    />

                    <span className="custom-toggle" />
                  </label>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

                  <div className="meal-form-actions">

                    <button
                      type="button"
                      className="cancel-meal-btn"
                      onClick={
                        closeModal
                      }
                      disabled={
                        submitting
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="submit-meal-btn"
                      disabled={
                        submitting
                      }
                    >
                      {submitting ? (
                        <>
                          <span className="meal-button-spinner" />

                          Saving...
                        </>
                      ) : (
                        <>
                          {editingMeal ? (
                            <FiEdit3 />
                          ) : (
                            <FiPlus />
                          )}

                          {editingMeal
                            ? "Update Meal"
                            : "Add Meal"}
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
    </div>
  );
};

export default ProviderMeal;