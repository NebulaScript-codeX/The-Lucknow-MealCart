import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaReceipt,
  FaShoppingBag,
  FaClipboardList,
  FaCheckCircle,
  FaBoxOpen,
  FaTruck,
  FaBan,
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import "./Order.css";

const STATUS_META = {
  placed: { label: "Placed", icon: <FaClipboardList />, tone: "mustard" },
  accepted: { label: "Accepted", icon: <FaCheckCircle />, tone: "sage" },
  preparing: { label: "Preparing", icon: <FaBoxOpen />, tone: "mustard" },
  "out-for-delivery": {
    label: "Out for Delivery",
    icon: <FaTruck />,
    tone: "brick",
  },
  delivered: { label: "Delivered", icon: <FaCheckCircle />, tone: "sage" },
  cancelled: { label: "Cancelled", icon: <FaBan />, tone: "muted" },
};

const Order = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/order/my-orders");

      if (res.data.success) {
        setOrders(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        toast.error(res.data.message || "Unable to fetch orders.");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="orders-page">
          <div className="orders-container">
            <div className="skeleton skeleton-back" />
            <div className="skeleton skeleton-title" />
            <div className="orders-list">
              <div className="skeleton skeleton-row" />
              <div className="skeleton skeleton-row" />
              <div className="skeleton skeleton-row" />
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

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <motion.section
          className="orders-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="orders-empty-box"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <FaReceipt className="orders-empty-icon" />
            <h1>No Orders Yet</h1>
            <p>Your placed orders will show up here.</p>
            <Link to="/meal/all">
              <button className="orders-shop-btn">Browse Meals</button>
            </Link>
          </motion.div>
        </motion.section>
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
        className="orders-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="orders-container">
          <div className="orders-top">
            <button className="back-btn" onClick={() => navigate("/")}>
              <FaArrowLeft />
              Back Home
            </button>

            <div className="orders-heading">
              <h1>My Orders</h1>
              <span className="orders-subheading">
                {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
                placed so far
              </span>
            </div>
          </div>

          <div className="orders-list">
            {orders.map((order, index) => {
              const meta = STATUS_META[order.orderStatus] || STATUS_META.placed;

              const itemCount =
                order.items?.reduce(
                  (sum, item) => sum + (item.quantity || 1),
                  0,
                ) || 0;

              const placedOn = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "";

              return (
                <motion.div
                  key={order._id}
                  className="order-row"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  onClick={() => navigate(`/track-order/${order._id}`)}
                >
                  <div className="order-row-left">
                    <div className="order-row-icon">
                      <FaShoppingBag />
                    </div>
                    <div className="order-row-info">
                      <h4>Order #{order._id?.slice(-8).toUpperCase()}</h4>
                      <span>
                        {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                        {placedOn}
                      </span>
                    </div>
                  </div>

                  <div className="order-row-right">
                    <strong>₹{order.totalAmount?.toFixed(0)}</strong>
                    <span className={`status-pill tone-${meta.tone}`}>
                      {meta.icon}
                      {meta.label}
                    </span>
                  </div>
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

export default Order;
