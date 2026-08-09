import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiFilter,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiTruck,
  FiUser,
  FiX,
  FiCreditCard,
  FiShoppingBag,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
} from "react-icons/fi";

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import axiosInstance from "../../../utils/axiosInstance";
import "./ProviderOrders.css";

const STATUS_CONFIG = {
  placed: {
    label: "Placed",
    className: "placed",
    icon: FiClock,
  },
  accepted: {
    label: "Accepted",
    className: "accepted",
    icon: FiCheckCircle,
  },
  preparing: {
    label: "Preparing",
    className: "preparing",
    icon: FiPackage,
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    className: "delivery",
    icon: FiTruck,
  },
  delivered: {
    label: "Delivered",
    className: "delivered",
    icon: FiCheck,
  },
  cancelled: {
    label: "Cancelled",
    className: "cancelled",
    icon: FiX,
  },
};

const STATUS_ORDER = [
  "placed",
  "accepted",
  "preparing",
  "out-for-delivery",
  "delivered",
];

const ProviderOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/order/provider-orders");

      if (res.data?.success) {
        setOrders(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        toast.error(res.data?.message || "Unable to fetch orders.");
        setOrders([]);
      }
    } catch (error) {
      console.error("Provider orders error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load provider orders.",
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    return (
      STATUS_CONFIG[status] || {
        label: status || "Unknown",
        className: "unknown",
        icon: FiPackage,
      }
    );
  };

  const getOrderId = (order) => {
    if (!order?._id) return "N/A";

    return `#${String(order._id).slice(-8).toUpperCase()}`;
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCustomerId = (order) => {
    if (!order?.customerId) return "Customer";

    const id =
      typeof order.customerId === "object"
        ? order.customerId?._id
        : order.customerId;

    if (!id) return "Customer";

    return `Customer ${String(id).slice(-6).toUpperCase()}`;
  };

  const getAddress = (order) => {
    const address = order?.deliveryAddress;

    if (!address || typeof address !== "object") {
      return {
        fullName: "Customer",
        phone: "Not available",
        addressLine: "Address unavailable",
        landmark: "",
        city: "",
        pincode: "",
      };
    }

    return {
      fullName: address.fullName || "Customer",
      phone: address.phone || "Not available",
      addressLine: address.addressLine || "Address unavailable",
      landmark: address.landmark || "",
      city: address.city || "",
      pincode: address.pincode || "",
    };
  };

  const getItems = (order) => {
    return Array.isArray(order?.items) ? order.items : [];
  };

  const getNextStatus = (status) => {
    const currentIndex = STATUS_ORDER.indexOf(status);

    if (currentIndex === -1) return null;

    return STATUS_ORDER[currentIndex + 1] || null;
  };

  const updateStatus = async (orderId, orderStatus) => {
    if (!orderId || !orderStatus) return;

    try {
      setActionLoading(`${orderId}-${orderStatus}`);

      const res = await axiosInstance.put(`/order/update-status/${orderId}`, {
        orderStatus,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Unable to update order status.");
      }

      toast.success(res.data?.message || "Order status updated successfully.");

      const updatedOrder = res.data?.data;

      setOrders((prev) =>
        prev.map((order) =>
          order?._id === orderId
            ? updatedOrder || {
                ...order,
                orderStatus,
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Update order status error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const acceptOrder = async (orderId) => {
    if (!orderId) return;

    try {
      setActionLoading(`${orderId}-accept`);

      const res = await axiosInstance.put(`/order/accept/${orderId}`);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Unable to accept order.");
      }

      toast.success(res.data?.message || "Order accepted successfully.");

      const updatedOrder = res.data?.data;

      setOrders((prev) =>
        prev.map((order) =>
          order?._id === orderId
            ? updatedOrder || {
                ...order,
                orderStatus: "accepted",
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Accept order error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to accept order.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const rejectOrder = async (orderId) => {
    if (!orderId) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this order?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(`${orderId}-reject`);

      const res = await axiosInstance.put(`/order/reject/${orderId}`);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Unable to reject order.");
      }

      toast.success(res.data?.message || "Order cancelled successfully.");

      const updatedOrder = res.data?.data;

      setOrders((prev) =>
        prev.map((order) =>
          order?._id === orderId
            ? updatedOrder || {
                ...order,
                orderStatus: "cancelled",
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Reject order error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to reject order.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = String(order?._id || "").toLowerCase();
      const status = String(order?.orderStatus || "").toLowerCase();

      const address = getAddress(order);

      const customerName = String(address?.fullName || "").toLowerCase();

      const phone = String(address?.phone || "").toLowerCase();

      const items = getItems(order);

      const itemSearch = items
        .map((item) => String(item?.title || ""))
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        orderId.includes(query) ||
        customerName.includes(query) ||
        phone.includes(query) ||
        itemSearch.includes(query);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      placed: orders.filter((order) => order?.orderStatus === "placed").length,
      preparing: orders.filter((order) => order?.orderStatus === "preparing")
        .length,
      delivery: orders.filter(
        (order) => order?.orderStatus === "out-for-delivery",
      ).length,
      delivered: orders.filter((order) => order?.orderStatus === "delivered")
        .length,
    };
  }, [orders]);

  const renderActionButton = (order) => {
    const status = order?.orderStatus;
    const orderId = order?._id;

    if (!orderId || status === "cancelled" || status === "delivered") {
      return null;
    }

    if (status === "placed") {
      return (
        <div className="provider-order-actions">
          <motion.button
            className="order-reject-btn"
            onClick={() => rejectOrder(orderId)}
            disabled={actionLoading === `${orderId}-reject`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiX />
            {actionLoading === `${orderId}-reject` ? "Rejecting..." : "Reject"}
          </motion.button>

          <motion.button
            className="order-primary-btn"
            onClick={() => acceptOrder(orderId)}
            disabled={actionLoading === `${orderId}-accept`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiCheck />
            {actionLoading === `${orderId}-accept`
              ? "Accepting..."
              : "Accept Order"}
          </motion.button>
        </div>
      );
    }

    const nextStatus = getNextStatus(status);

    if (!nextStatus) return null;

    const nextConfig = getStatusConfig(nextStatus);
    const NextIcon = nextConfig.icon;

    return (
      <div className="provider-order-actions">
        <motion.button
          className="order-primary-btn"
          onClick={() => updateStatus(orderId, nextStatus)}
          disabled={actionLoading === `${orderId}-${nextStatus}`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <NextIcon />

          {actionLoading === `${orderId}-${nextStatus}`
            ? "Updating..."
            : `Mark ${nextConfig.label}`}
        </motion.button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="provider-orders-page">
        <Navbar />

        <main className="provider-orders-container">
          <div className="provider-orders-loading-header">
            <div className="order-shimmer eyebrow" />
            <div className="order-shimmer title" />
            <div className="order-shimmer text" />
          </div>

          <div className="provider-order-stats">
            {[1, 2, 3, 4].map((item) => (
              <div className="provider-order-stat-skeleton" key={item}>
                <div className="order-shimmer stat-icon" />
                <div>
                  <div className="order-shimmer stat-small" />
                  <div className="order-shimmer stat-number" />
                </div>
              </div>
            ))}
          </div>

          <div className="provider-orders-toolbar">
            <div className="order-shimmer toolbar-search" />
            <div className="order-shimmer toolbar-filter" />
          </div>

          <div className="provider-orders-skeleton-list">
            {[1, 2, 3].map((item) => (
              <div className="provider-order-skeleton" key={item}>
                <div className="order-shimmer skeleton-line large" />
                <div className="order-shimmer skeleton-line medium" />
                <div className="order-shimmer skeleton-line small" />
                <div className="order-shimmer skeleton-button" />
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="provider-orders-page">
      <Navbar />

      <main className="provider-orders-container">
        <motion.section
          className="provider-orders-header"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="provider-orders-heading">
            <div className="orders-eyebrow">
              <FiShoppingBag />
              <span>PROVIDER WORKSPACE</span>
            </div>

            <h1>
              Manage your <span>orders.</span>
            </h1>

            <p>
              Track incoming orders, manage preparation and keep customers
              updated throughout the delivery process.
            </p>
          </div>

          <motion.button
            className="refresh-orders-btn"
            onClick={fetchOrders}
            whileHover={{ rotate: 8, y: -2 }}
            whileTap={{ scale: 0.94 }}
          >
            <FiRefreshCw />
            Refresh Orders
          </motion.button>
        </motion.section>

        <motion.section
          className="provider-order-stats"
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
          <motion.div
            className="provider-order-stat"
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
            <div className="provider-order-stat-icon orange">
              <FiShoppingBag />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{stats.total}</strong>
            </div>
          </motion.div>

          <motion.div
            className="provider-order-stat"
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
            <div className="provider-order-stat-icon amber">
              <FiClock />
            </div>

            <div>
              <span>New Orders</span>
              <strong>{stats.placed}</strong>
            </div>
          </motion.div>

          <motion.div
            className="provider-order-stat"
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
            <div className="provider-order-stat-icon blue">
              <FiPackage />
            </div>

            <div>
              <span>Preparing</span>
              <strong>{stats.preparing}</strong>
            </div>
          </motion.div>

          <motion.div
            className="provider-order-stat"
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
            <div className="provider-order-stat-icon green">
              <FiCheckCircle />
            </div>

            <div>
              <span>Delivered</span>
              <strong>{stats.delivered}</strong>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="provider-orders-toolbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="provider-order-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search order, customer, phone or meal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="provider-order-filter">
            <FiFilter />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="placed">Placed</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <FiChevronDown />
          </div>
        </motion.section>

        <section className="provider-orders-section-heading">
          <div>
            <span>ORDER MANAGEMENT</span>
            <h2>Incoming orders</h2>

            <p>
              Showing <strong>{filteredOrders.length}</strong> of{" "}
              <strong>{orders.length}</strong> orders
            </p>
          </div>

          {stats.delivery > 0 && (
            <div className="delivery-live-indicator">
              <span />
              {stats.delivery} out for delivery
            </div>
          )}
        </section>

        {filteredOrders.length === 0 ? (
          <motion.div
            className="provider-orders-empty"
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            <div className="provider-orders-empty-icon">
              {orders.length === 0 ? <FiShoppingBag /> : <FiSearch />}
            </div>

            <h3>{orders.length === 0 ? "No orders yet" : "No orders found"}</h3>

            <p>
              {orders.length === 0
                ? "New customer orders will appear here."
                : "Try changing your search or status filter."}
            </p>

            {orders.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                <FiRefreshCw />
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="provider-orders-list"
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
            {filteredOrders.map((order) => {
              if (!order) return null;

              const status = order?.orderStatus || "placed";
              const config = getStatusConfig(status);
              const StatusIcon = config.icon;

              const address = getAddress(order);
              const items = getItems(order);

              const isExpanded = expandedOrder === order?._id;

              const totalAmount = Number(order?.totalAmount || 0);

              const paymentMethod = order?.paymentMethod || "COD";

              const paymentStatus = order?.paymentStatus || "pending";

              return (
                <motion.article
                  className={`provider-order-card ${
                    status === "cancelled" ? "order-card-cancelled" : ""
                  }`}
                  key={order?._id}
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
                  layout
                >
                  <div className="provider-order-card-top">
                    <div className="provider-order-id-block">
                      <div className="provider-order-icon">
                        <FiPackage />
                      </div>

                      <div>
                        <span>ORDER ID</span>

                        <h3>{getOrderId(order)}</h3>

                        <p>
                          {formatDate(order?.createdAt)}
                          {" • "}
                          {formatTime(order?.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`provider-order-status ${config.className}`}
                    >
                      <StatusIcon />
                      {config.label}
                    </div>
                  </div>

                  <div className="provider-order-main">
                    <div className="provider-order-customer">
                      <div className="order-info-label">
                        <FiUser />
                        <span>CUSTOMER</span>
                      </div>

                      <strong>
                        {address.fullName || getCustomerId(order)}
                      </strong>

                      <p>{getCustomerId(order)}</p>

                      {address.phone && address.phone !== "Not available" && (
                        <a
                          href={`tel:${address.phone}`}
                          className="order-phone"
                        >
                          <FiPhone />
                          {address.phone}
                        </a>
                      )}
                    </div>

                    <div className="provider-order-delivery">
                      <div className="order-info-label">
                        <FiMapPin />
                        <span>DELIVERY ADDRESS</span>
                      </div>

                      <strong>{address.addressLine}</strong>

                      <p>
                        {[address.landmark, address.city, address.pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="provider-order-payment">
                      <div className="order-info-label">
                        <FiCreditCard />
                        <span>PAYMENT</span>
                      </div>

                      <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>

                      <p>
                        {paymentMethod}{" "}
                        <span
                          className={`payment-badge ${
                            paymentStatus === "paid" ? "paid" : "pending"
                          }`}
                        >
                          {paymentStatus}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="provider-order-items">
                    <div className="order-items-heading">
                      <div>
                        <FiShoppingBag />
                        <span>
                          {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
                        </span>
                      </div>

                      <button onClick={() => toggleOrder(order?._id)}>
                        {isExpanded ? "Hide Details" : "View Details"}

                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>

                    <div className="order-items-preview">
                      {items
                        .slice(0, isExpanded ? items.length : 2)
                        .map((item, index) => (
                          <div
                            className="provider-order-item"
                            key={item?.mealId || `${order?._id}-${index}`}
                          >
                            <div className="order-item-number">{index + 1}</div>

                            <div className="order-item-content">
                              <strong>{item?.title || "Unnamed Meal"}</strong>

                              <span>Qty: {Number(item?.quantity || 1)}</span>
                            </div>

                            <strong className="order-item-price">
                              ₹
                              {(
                                Number(item?.price || 0) *
                                Number(item?.quantity || 1)
                              ).toLocaleString("en-IN")}
                            </strong>
                          </div>
                        ))}
                    </div>

                    {!isExpanded && items.length > 2 && (
                      <div className="more-items">
                        +{items.length - 2} more items
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="provider-order-details"
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                      >
                        <div className="order-details-grid">
                          <div>
                            <span>SUBTOTAL</span>
                            <strong>
                              ₹
                              {Number(order?.subtotal || 0).toLocaleString(
                                "en-IN",
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>DELIVERY FEE</span>
                            <strong>
                              ₹
                              {Number(order?.deliveryFee || 0).toLocaleString(
                                "en-IN",
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>TAX</span>
                            <strong>
                              ₹{Number(order?.tax || 0).toLocaleString("en-IN")}
                            </strong>
                          </div>

                          <div className="order-total-box">
                            <span>TOTAL</span>
                            <strong>
                              <FiDollarSign />
                              {totalAmount.toLocaleString("en-IN")}
                            </strong>
                          </div>
                        </div>

                        <div className="order-address-full">
                          <div className="order-info-label">
                            <FiMapPin />
                            <span>FULL DELIVERY DETAILS</span>
                          </div>

                          <p>
                            <strong>{address.fullName}</strong>
                            {" • "}
                            {address.phone}
                          </p>

                          <p>
                            {address.addressLine}
                            {address.landmark ? `, ${address.landmark}` : ""}
                            {address.city ? `, ${address.city}` : ""}
                            {address.pincode ? ` - ${address.pincode}` : ""}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="provider-order-footer">
                    <div className="order-total-summary">
                      <span>Total Amount</span>

                      <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
                    </div>

                    {renderActionButton(order)}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProviderOrder;
