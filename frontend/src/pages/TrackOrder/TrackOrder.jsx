import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaReceipt,
  FaTruck,
  FaCheckCircle,
  FaClipboardList,
  FaBoxOpen,
  FaBan,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import "./TrackOrder.css";

// Order of the happy-path statuses used to drive the stepper.
// "cancelled" is handled separately since it isn't part of the sequence.
const STEP_SEQUENCE = [
  { key: "placed", label: "Order Placed", icon: <FaClipboardList /> },
  { key: "accepted", label: "Accepted", icon: <FaCheckCircle /> },
  { key: "preparing", label: "Preparing", icon: <FaBoxOpen /> },
  { key: "out-for-delivery", label: "Out for Delivery", icon: <FaTruck /> },
  { key: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/order/${orderId}`);

      if (res.data.success && res.data.data) {
        setOrder(res.data.data);
      } else {
        toast.error(res.data.message || "Order not found.");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to fetch order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="track-page">
          <div className="track-container">
            <div className="skeleton skeleton-back" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-stepper" />
            <div className="skeleton skeleton-card" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // =====================================
  // NOT FOUND GUARD
  // =====================================

  if (!order) {
    return (
      <>
        <Navbar />
        <section className="track-empty">
          <div className="track-empty-box">
            <FaReceipt className="track-empty-icon" />
            <h1>Order Not Found</h1>
            <p>We couldn't find the order you're looking for.</p>
            <Link to="/orders">
              <button className="track-shop-btn">View My Orders</button>
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const isCancelled = order.orderStatus === "cancelled";

  const currentStepIndex = STEP_SEQUENCE.findIndex(
    (step) => step.key === order.orderStatus,
  );

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <>
      <Navbar />

      <motion.div
        className="track-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="track-container">
          <div className="track-top">
            <button className="back-btn" onClick={() => navigate("/orders")}>
              <FaArrowLeft />
              My Orders
            </button>

            <div className="track-heading">
              <h1>Track Order</h1>
              <span className="track-subheading">
                Order #{order._id?.slice(-8).toUpperCase()} · placed {createdAt}
              </span>
            </div>
          </div>

          {/* ===== STATUS STEPPER ===== */}
          <motion.section
            className="track-section"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isCancelled ? (
              <div className="cancelled-banner">
                <FaBan />
                <span>This order has been cancelled.</span>
              </div>
            ) : (
              <div className="stepper">
                {STEP_SEQUENCE.map((step, index) => {
                  const isDone = index <= currentStepIndex;
                  const isActive = index === currentStepIndex;

                  return (
                    <div
                      className={`stepper-item ${isDone ? "is-done" : ""} ${
                        isActive ? "is-active" : ""
                      }`}
                      key={step.key}
                    >
                      <div className="stepper-icon">{step.icon}</div>
                      <span className="stepper-label">{step.label}</span>
                      {index < STEP_SEQUENCE.length - 1 && (
                        <div className="stepper-line" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>

          <div className="track-layout">
            <div className="track-form-col">
              {/* ===== DELIVERY ADDRESS ===== */}
              <motion.section
                className="track-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <div className="card-head">
                  <FaMapMarkerAlt />
                  <h2>Delivery Address</h2>
                </div>

                <div className="address-block">
                  <strong>{order.deliveryAddress?.fullName}</strong>
                  <span>{order.deliveryAddress?.phone}</span>
                  <span>
                    {order.deliveryAddress?.addressLine}
                    {order.deliveryAddress?.landmark
                      ? `, near ${order.deliveryAddress.landmark}`
                      : ""}
                  </span>
                  <span>
                    {order.deliveryAddress?.city} -{" "}
                    {order.deliveryAddress?.pincode}
                  </span>
                </div>
              </motion.section>

              {/* ===== ITEMS ===== */}
              <motion.section
                className="track-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="card-head">
                  <FaReceipt />
                  <h2>Items</h2>
                </div>

                <div className="track-item-list">
                  {order.items?.map((item, index) => (
                    <div className="track-item-row" key={item.mealId || index}>
                      <div className="track-item-info">
                        <h4>{item.title}</h4>
                        <span>Qty {item.quantity}</span>
                      </div>
                      <strong>
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </strong>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* ===== SUMMARY ===== */}
            <motion.div
              className="track-summary"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="track-summary-head">
                <FaReceipt />
                <h2>Bill Summary</h2>
              </div>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{order.subtotal?.toFixed(2)}</strong>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <strong>₹{order.deliveryFee?.toFixed(2)}</strong>
              </div>
              <div className="summary-row">
                <span>GST</span>
                <strong>₹{order.tax?.toFixed(2)}</strong>
              </div>

              <div className="perforation" aria-hidden="true" />

              <div className="total-row">
                <span>Total Paid</span>
                <h2>₹{order.totalAmount?.toFixed(2)}</h2>
              </div>

              <div className="payment-note">
                {order.paymentMethod === "COD" ? (
                  <FaMoneyBillWave />
                ) : (
                  <FaCreditCard />
                )}
                <span>
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "Paid Online"}{" "}
                  · {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default TrackOrder;
