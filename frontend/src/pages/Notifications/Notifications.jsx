import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

import {
  FaBell,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaInbox,
} from "react-icons/fa";

import "./Notifications.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState(null);

  // ================================
  // FETCH NOTIFICATIONS
  // ================================
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/notification/my-notifications"
      );

      if (res.data?.success) {
        setNotifications(
          Array.isArray(res.data.data) ? res.data.data : []
        );
      } else {
        setNotifications([]);
        toast.error(
          res.data?.message || "Unable to load notifications."
        );
      }
    } catch (err) {
      console.error("Notification Fetch Error:", err);

      setNotifications([]);

      toast.error(
        err.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ================================
  // INITIAL FETCH
  // ================================
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ================================
  // MARK AS READ
  // ================================
  const handleRead = async (notificationId) => {
    if (pendingId) return;

    try {
      setPendingId(notificationId);

      const res = await axiosInstance.put(
        `/notification/read/${notificationId}`
      );

      if (res.data?.success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notificationId
              ? { ...item, isRead: true }
              : item
          )
        );

        // Notify Navbar to refresh unread count
        window.dispatchEvent(
          new Event("notificationUpdated")
        );
      } else {
        toast.error(
          res.data?.message ||
            "Unable to update notification."
        );
      }
    } catch (err) {
      console.error("Mark Notification Read Error:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to update notification."
      );
    } finally {
      setPendingId(null);
    }
  };

  // ================================
  // DELETE NOTIFICATION
  // ================================
  const handleDelete = async (notificationId) => {
    if (pendingId) return;

    const confirmed = window.confirm(
      "Delete this notification?"
    );

    if (!confirmed) return;

    try {
      setPendingId(notificationId);

      const res = await axiosInstance.delete(
        `/notification/delete/${notificationId}`
      );

      if (res.data?.success) {
        toast.success("Notification deleted.");

        setNotifications((prev) =>
          prev.filter(
            (item) => item._id !== notificationId
          )
        );

        // Notify Navbar to refresh unread count
        window.dispatchEvent(
          new Event("notificationUpdated")
        );
      } else {
        toast.error(
          res.data?.message ||
            "Unable to delete notification."
        );
      }
    } catch (err) {
      console.error(
        "Delete Notification Error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to delete notification."
      );
    } finally {
      setPendingId(null);
    }
  };

  // ================================
  // UNREAD COUNT
  // ================================
  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  // ================================
  // LOADING UI
  // ================================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="notification-page">
          <div className="notification-container">
            <div className="notification-heading">
              <h1>
                <FaBell />
                Notifications
              </h1>

              <p>
                Stay updated with your latest activities
              </p>
            </div>

            <div className="notification-list">
              {[0, 1, 2].map((i) => (
                <div
                  className="notification-skeleton"
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ================================
  // MAIN UI
  // ================================
  return (
    <>
      <Navbar />

      <motion.section
        className="notification-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="notification-container">
          {/* HEADER */}
          <div className="notification-heading">
            <h1>
              <FaBell />
              Notifications
            </h1>

            <p>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${
                    unreadCount === 1 ? "" : "s"
                  }`
                : "You're all caught up"}
            </p>
          </div>

          {/* EMPTY STATE */}
          {notifications.length === 0 ? (
            <motion.div
              className="notification-empty"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              <FaInbox className="empty-icon" />

              <h2>No Notifications Yet</h2>

              <p>
                You're all caught up. New updates will
                appear here.
              </p>
            </motion.div>
          ) : (
            /* NOTIFICATION LIST */
            <div className="notification-list">
              <AnimatePresence initial={false}>
                {notifications.map((item, index) => {
                  const isPending =
                    pendingId === item._id;

                  return (
                    <motion.div
                      key={item._id}
                      className={`notification-card ${
                        item.isRead
                          ? "read"
                          : "unread"
                      }`}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: 40,
                        height: 0,
                        marginBottom: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                      }}
                    >
                      {/* ICON */}
                      <div className="notification-left">
                        <div className="notification-icon">
                          <FaBell />
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="notification-content">
                        <div className="notification-top">
                          <h3>
                            {item.title ||
                              "Notification"}
                          </h3>

                          {!item.isRead && (
                            <span className="unread-badge">
                              New
                            </span>
                          )}
                        </div>

                        <p>
                          {item.message ||
                            "You have a new notification."}
                        </p>

                        <div className="notification-time">
                          <FaClock />

                          <span>
                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleString()
                              : "—"}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="notification-actions">
                        {!item.isRead && (
                          <button
                            className="read-btn"
                            disabled={isPending}
                            onClick={() =>
                              handleRead(
                                item._id
                              )
                            }
                          >
                            <FaCheckCircle />

                            {isPending
                              ? "Please wait…"
                              : "Read"}
                          </button>
                        )}

                        <button
                          className="delete-btn"
                          disabled={isPending}
                          aria-label="Delete notification"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

export default Notification;