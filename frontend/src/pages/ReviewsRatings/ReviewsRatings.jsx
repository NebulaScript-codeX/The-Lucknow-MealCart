import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  FaStar,
  FaRegStar,
  FaTrash,
  FaUtensils,
  FaPen,
  FaCommentAlt,
  FaArrowRight,
  FaCheckCircle,
  FaBoxOpen,
  FaCalendarAlt,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";

import "./ReviewsRatings.css";

const ReviewsRatings = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =========================================================
  // LOAD ORDERS + REVIEWS
  // =========================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [ordersRes, reviewsRes] = await Promise.all([
        axiosInstance.get("/order/my-orders"),
        axiosInstance.get("/review/my-reviews"),
      ]);

      if (ordersRes.data?.success) {
        setOrders(
          Array.isArray(ordersRes.data.data)
            ? ordersRes.data.data
            : [],
        );
      } else {
        setOrders([]);
      }

      if (reviewsRes.data?.success) {
        setReviews(
          Array.isArray(reviewsRes.data.data)
            ? reviewsRes.data.data
            : [],
        );
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Reviews page loading error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load your reviews right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================

  const getMealId = (item) => {
    if (!item) return null;

    const meal =
      item.mealId ||
      item.meal ||
      item.productId;

    if (!meal) return null;

    return typeof meal === "object"
      ? meal._id
      : meal;
  };

  const getMealTitle = (item) => {
    if (!item) return "Meal";

    const meal =
      item.mealId ||
      item.meal ||
      item.productId;

    if (typeof meal === "object") {
      return (
        meal.title ||
        meal.name ||
        item.title ||
        "Meal"
      );
    }

    return item.title || "Meal";
  };

  const getMealImage = (item) => {
    if (!item) return null;

    const meal =
      item.mealId ||
      item.meal ||
      item.productId;

    if (typeof meal === "object") {
      return meal.image || null;
    }

    return item.image || null;
  };

  const getKitchenId = (order) => {
    if (!order?.kitchenId) return null;

    return typeof order.kitchenId === "object"
      ? order.kitchenId._id
      : order.kitchenId;
  };

  const getKitchenName = (order) => {
    if (!order?.kitchenId) return "Kitchen";

    if (typeof order.kitchenId === "object") {
      return (
        order.kitchenId.kitchenName ||
        order.kitchenId.name ||
        "Kitchen"
      );
    }

    return "Kitchen";
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);

    return `₹${value.toLocaleString("en-IN")}`;
  };

  // =========================================================
  // DELIVERED ORDERS
  // =========================================================

  const deliveredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        String(order.orderStatus || "").toLowerCase() ===
        "delivered",
    );
  }, [orders]);

  // =========================================================
  // REVIEWED ORDER + MEAL COMBINATIONS
  // =========================================================

  const reviewedItems = useMemo(() => {
    const set = new Set();

    reviews.forEach((review) => {
      const orderId =
        typeof review.orderId === "object"
          ? review.orderId?._id
          : review.orderId;

      const mealId =
        typeof review.mealId === "object"
          ? review.mealId?._id
          : review.mealId;

      if (orderId && mealId) {
        set.add(`${orderId}_${mealId}`);
      }
    });

    return set;
  }, [reviews]);

  // =========================================================
  // REVIEWABLE ORDERS
  // =========================================================

  const reviewableOrders = useMemo(() => {
    return deliveredOrders
      .map((order) => {
        const availableItems = (order.items || []).filter(
          (item) => {
            const mealId = getMealId(item);

            if (!mealId) return false;

            const key = `${order._id}_${mealId}`;

            return !reviewedItems.has(key);
          },
        );

        return {
          ...order,
          reviewableItems: availableItems,
        };
      })
      .filter(
        (order) => order.reviewableItems.length > 0,
      );
  }, [deliveredOrders, reviewedItems]);

  // =========================================================
  // SELECTED ORDER
  // =========================================================

  const selectedOrderData = useMemo(() => {
    return reviewableOrders.find(
      (order) => order._id === selectedOrder,
    );
  }, [reviewableOrders, selectedOrder]);

  // =========================================================
  // SELECTED MEAL
  // =========================================================

  const selectedMealData = useMemo(() => {
    if (!selectedOrderData) return null;

    return selectedOrderData.reviewableItems.find(
      (item) =>
        String(getMealId(item)) === String(selectedMeal),
    );
  }, [selectedOrderData, selectedMeal]);

  // =========================================================
  // DEFAULT ORDER
  // =========================================================

  useEffect(() => {
    if (reviewableOrders.length === 0) {
      setSelectedOrder("");
      setSelectedMeal("");
      return;
    }

    const currentOrderExists = reviewableOrders.some(
      (order) => order._id === selectedOrder,
    );

    if (!currentOrderExists) {
      const firstOrder = reviewableOrders[0];

      setSelectedOrder(firstOrder._id);

      const firstMeal = firstOrder.reviewableItems?.[0];

      setSelectedMeal(
        firstMeal ? getMealId(firstMeal) : "",
      );
    }
  }, [reviewableOrders, selectedOrder]);

  // =========================================================
  // ORDER CHANGE
  // =========================================================

  const handleOrderChange = (e) => {
    const orderId = e.target.value;

    setSelectedOrder(orderId);

    const order = reviewableOrders.find(
      (item) => item._id === orderId,
    );

    const firstMeal = order?.reviewableItems?.[0];

    setSelectedMeal(
      firstMeal ? getMealId(firstMeal) : "",
    );

    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  // =========================================================
  // MEAL CHANGE
  // =========================================================

  const handleMealChange = (e) => {
    setSelectedMeal(e.target.value);

    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrder) {
      toast.error("Please select an order.");
      return;
    }

    if (!selectedMeal) {
      toast.error("Please select a meal.");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a short review.");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error(
        "Review should contain at least 3 characters.",
      );
      return;
    }

    const kitchenId = getKitchenId(selectedOrderData);

    if (!kitchenId) {
      toast.error("Kitchen information is missing.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axiosInstance.post(
        "/review/add",
        {
          orderId: selectedOrder,
          kitchenId,
          mealId: selectedMeal,
          rating,
          comment: comment.trim(),
        },
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to post review.",
        );
        return;
      }

      toast.success(
        response.data?.message ||
          "Review added successfully!",
      );

      setRating(0);
      setHoverRating(0);
      setComment("");

      await loadData();
    } catch (error) {
      console.error("Add review error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to post your review.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDelete = async (reviewId) => {
    if (!reviewId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this review?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(reviewId);

      const response = await axiosInstance.delete(
        `/review/delete/${reviewId}`,
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Unable to delete review.",
        );
        return;
      }

      toast.success(
        response.data?.message ||
          "Review deleted successfully.",
      );

      setReviews((prev) =>
        prev.filter(
          (review) => review._id !== reviewId,
        ),
      );
    } catch (error) {
      console.error("Delete review error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete review.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // REVIEW KITCHEN NAME
  // =========================================================

  const getReviewKitchenName = (review) => {
    if (!review?.kitchenId) return "Kitchen";

    if (typeof review.kitchenId === "object") {
      return (
        review.kitchenId.kitchenName ||
        "Kitchen"
      );
    }

    return "Kitchen";
  };

  // =========================================================
  // REVIEW MEAL NAME
  // =========================================================

  const getReviewMealName = (review) => {
    if (!review?.mealId) return "Meal";

    if (typeof review.mealId === "object") {
      return (
        review.mealId.title ||
        review.mealId.name ||
        "Meal"
      );
    }

    return "Meal";
  };

  // =========================================================
  // STARS
  // =========================================================

  const renderStars = (
    value,
    interactive = false,
  ) => {
    return Array.from({ length: 5 }).map(
      (_, index) => {
        const starValue = index + 1;

        const activeValue = interactive
          ? hoverRating || rating
          : value;

        const filled =
          starValue <= activeValue;

        if (interactive) {
          return (
            <motion.button
              key={starValue}
              type="button"
              className={`rating-star ${
                filled ? "active" : ""
              }`}
              whileHover={{
                scale: 1.18,
                y: -2,
              }}
              whileTap={{
                scale: 0.9,
              }}
              onMouseEnter={() =>
                setHoverRating(starValue)
              }
              onMouseLeave={() =>
                setHoverRating(0)
              }
              onClick={() =>
                setRating(starValue)
              }
              aria-label={`${starValue} star`}
            >
              {filled ? (
                <FaStar />
              ) : (
                <FaRegStar />
              )}
            </motion.button>
          );
        }

        return filled ? (
          <FaStar
            key={starValue}
            className="review-star filled"
          />
        ) : (
          <FaRegStar
            key={starValue}
            className="review-star empty"
          />
        );
      },
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="reviews-page">
          <div className="reviews-container">
            <div className="reviews-skeleton-hero">
              <div className="skeleton-line skeleton-small" />
              <div className="skeleton-line skeleton-large" />
              <div className="skeleton-line skeleton-medium" />
            </div>

            <div className="reviews-layout">
              <div className="review-form-card skeleton-card">
                <div className="skeleton-line skeleton-medium" />
                <div className="skeleton-box" />
                <div className="skeleton-box small" />
                <div className="skeleton-box" />
              </div>

              <div className="my-reviews-card skeleton-card">
                <div className="skeleton-line skeleton-medium" />

                {[1, 2, 3].map((item) => (
                  <div
                    className="review-skeleton-row"
                    key={item}
                  >
                    <div className="skeleton-avatar" />

                    <div className="skeleton-content">
                      <div className="skeleton-line skeleton-medium" />
                      <div className="skeleton-line skeleton-small" />
                      <div className="skeleton-box text" />
                    </div>
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

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="reviews-page">
        <div className="reviews-bg-orb orb-one" />
        <div className="reviews-bg-orb orb-two" />

        <div className="reviews-container">
          {/* HERO */}

          <motion.section
            className="reviews-hero"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className="hero-eyebrow">
              <span className="eyebrow-icon">
                <FaStar />
              </span>

              YOUR EXPERIENCE MATTERS
            </div>

            <h1>
              Reviews &<span> Ratings</span>
            </h1>

            <p>
              Review the meals you actually ordered and
              help other food lovers discover great
              kitchens.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>
                  {reviews.length}
                </strong>

                <span>Your Reviews</span>
              </div>

              <div className="hero-divider" />

              <div className="hero-stat">
                <strong>
                  {deliveredOrders.length}
                </strong>

                <span>Delivered Orders</span>
              </div>

              <div className="hero-divider" />

              <div className="hero-stat">
                <strong>
                  {reviewableOrders.reduce(
                    (total, order) =>
                      total +
                      order.reviewableItems.length,
                    0,
                  )}
                </strong>

                <span>Meals to Review</span>
              </div>
            </div>
          </motion.section>

          {/* MAIN */}

          <section className="reviews-layout">
            {/* WRITE REVIEW */}

            <motion.div
              className="review-form-card"
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
            >
              <div className="card-glow" />

              <div className="form-card-header">
                <div className="form-icon">
                  <FaPen />
                </div>

                <div>
                  <span className="section-kicker">
                    SHARE YOUR EXPERIENCE
                  </span>

                  <h2>Write a Review</h2>
                </div>
              </div>

              {reviewableOrders.length === 0 ? (
                <div className="no-review-state">
                  <div className="empty-icon">
                    <FaCheckCircle />
                  </div>

                  <h3>You're all caught up!</h3>

                  <p>
                    You don't have any delivered meals
                    waiting for a review. Once you order
                    and receive a meal, you can share your
                    experience here.
                  </p>
                </div>
              ) : (
                <form
                  className="review-form"
                  onSubmit={handleSubmit}
                >
                  {/* ORDER */}

                  <div className="form-field">
                    <label htmlFor="order">
                      Select Delivered Order
                    </label>

                    <div className="select-wrapper">
                      <FaBoxOpen className="select-icon" />

                      <select
                        id="order"
                        value={selectedOrder}
                        onChange={
                          handleOrderChange
                        }
                      >
                        <option value="">
                          Choose an order
                        </option>

                        {reviewableOrders.map(
                          (order) => (
                            <option
                              key={order._id}
                              value={order._id}
                            >
                              {getKitchenName(
                                order,
                              )}{" "}
                              •{" "}
                              {formatDate(
                                order.createdAt,
                              )}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    {selectedOrderData && (
                      <div className="selected-order-info">
                        <FaCalendarAlt />

                        <span>
                          Delivered order from{" "}
                          <strong>
                            {getKitchenName(
                              selectedOrderData,
                            )}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* MEAL */}

                  <div className="form-field">
                    <label htmlFor="meal">
                      Select Meal
                    </label>

                    <div className="select-wrapper">
                      <FaUtensils className="select-icon" />

                      <select
                        id="meal"
                        value={selectedMeal}
                        onChange={
                          handleMealChange
                        }
                        disabled={
                          !selectedOrderData
                        }
                      >
                        <option value="">
                          Choose a meal
                        </option>

                        {selectedOrderData?.reviewableItems?.map(
                          (item, index) => (
                            <option
                              key={
                                getMealId(item) ||
                                index
                              }
                              value={getMealId(
                                item,
                              )}
                            >
                              {getMealTitle(
                                item,
                              )}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    {selectedMealData && (
                      <div className="selected-meal-preview">
                        <div className="meal-preview-icon">
                          🍱
                        </div>

                        <div>
                          <strong>
                            {getMealTitle(
                              selectedMealData,
                            )}
                          </strong>

                          <span>
                            Ordered meal
                            {selectedMealData.quantity
                              ? ` • Qty ${selectedMealData.quantity}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RATING */}

                  <div className="form-field rating-field">
                    <label>Your Rating</label>

                    <div className="rating-selector">
                      <div className="interactive-stars">
                        {renderStars(
                          0,
                          true,
                        )}
                      </div>

                      <span className="rating-text">
                        {rating === 0
                          ? "Tap a star"
                          : rating === 1
                            ? "Not great"
                            : rating === 2
                              ? "Could be better"
                              : rating === 3
                                ? "It's good"
                                : rating === 4
                                  ? "Really good"
                                  : "Absolutely loved it!"}
                      </span>
                    </div>
                  </div>

                  {/* COMMENT */}

                  <div className="form-field">
                    <div className="label-row">
                      <label htmlFor="comment">
                        Your Review
                      </label>

                      <span>
                        {comment.length}/500
                      </span>
                    </div>

                    <div className="textarea-wrapper">
                      <FaCommentAlt className="textarea-icon" />

                      <textarea
                        id="comment"
                        value={comment}
                        maxLength={500}
                        onChange={(e) =>
                          setComment(
                            e.target.value,
                          )
                        }
                        placeholder="Tell us what you loved about this meal..."
                        rows={6}
                      />
                    </div>
                  </div>

                  {/* SUBMIT */}

                  <motion.button
                    type="submit"
                    className="submit-review-btn"
                    disabled={submitting}
                    whileHover={
                      !submitting
                        ? {
                            y: -3,
                            boxShadow:
                              "0 18px 35px rgba(245,121,58,.25)",
                          }
                        : {}
                    }
                    whileTap={
                      !submitting
                        ? {
                            scale: 0.98,
                          }
                        : {}
                    }
                  >
                    {submitting ? (
                      <>
                        <span className="button-loader" />
                        Posting...
                      </>
                    ) : (
                      <>
                        Post Review
                        <FaArrowRight />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* MY REVIEWS */}

            <motion.div
              className="my-reviews-card"
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.15,
              }}
            >
              <div className="reviews-list-header">
                <div>
                  <span className="section-kicker">
                    YOUR FEEDBACK
                  </span>

                  <h2>Your Reviews</h2>
                </div>

                <div className="review-count">
                  {reviews.length}
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="reviews-empty">
                  <div className="empty-review-illustration">
                    <FaCommentAlt />
                  </div>

                  <h3>No reviews yet</h3>

                  <p>
                    Your meal reviews will appear here
                    after you share your experience.
                  </p>
                </div>
              ) : (
                <div className="reviews-list">
                  <AnimatePresence mode="popLayout">
                    {reviews.map(
                      (review, index) => (
                        <motion.article
                          className="review-item"
                          key={review._id}
                          initial={{
                            opacity: 0,
                            y: 15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            x: 50,
                            height: 0,
                            marginBottom: 0,
                          }}
                          transition={{
                            delay: index * 0.06,
                          }}
                          layout
                        >
                          <div className="review-item-top">
                            <div className="review-kitchen">
                              <div className="kitchen-avatar">
                                <FaUtensils />
                              </div>

                              <div>
                                <h3>
                                  {getReviewMealName(
                                    review,
                                  )}
                                </h3>

                                <span>
                                  {getReviewKitchenName(
                                    review,
                                  )}{" "}
                                  •{" "}
                                  {formatDate(
                                    review.createdAt,
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="review-rating">
                              {renderStars(
                                review.rating || 0,
                                false,
                              )}
                            </div>
                          </div>

                          <div className="review-comment">
                            <p>
                              {review.comment}
                            </p>
                          </div>

                          <div className="review-item-footer">
                            <span className="verified-review">
                              <FaCheckCircle />
                              Verified meal order
                            </span>

                            <button
                              type="button"
                              className="delete-review-btn"
                              disabled={
                                deletingId ===
                                review._id
                              }
                              onClick={() =>
                                handleDelete(
                                  review._id,
                                )
                              }
                            >
                              {deletingId ===
                              review._id ? (
                                <span className="mini-loader" />
                              ) : (
                                <FaTrash />
                              )}

                              Delete
                            </button>
                          </div>
                        </motion.article>
                      ),
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ReviewsRatings;