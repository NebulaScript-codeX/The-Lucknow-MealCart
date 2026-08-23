import React, { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";

import "./Checkout.css";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaReceipt,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
  FaShoppingBag,
} from "react-icons/fa";

import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";

import Footer from "../../components/Footer/Footer";

import axiosInstance from "../../utils/axiosInstance";

import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();

  const { setCartCount, refreshCart } = useCart();

  const [loading, setLoading] = useState(true);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    landmark: "",
    city: "Lucknow",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  // =====================================
  // FETCH CART
  // =====================================

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/cart/my-cart");

      let items = [];

      if (res.data.success) {
        if (Array.isArray(res.data.data?.items)) {
          items = res.data.data.items;
        } else if (Array.isArray(res.data.data)) {
          items = res.data.data;
        } else if (Array.isArray(res.data.cart?.items)) {
          items = res.data.cart.items;
        } else if (Array.isArray(res.data.items)) {
          items = res.data.items;
        }
      }

      setCartItems(items);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Unable to fetch cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =====================================
  // HELPERS
  // =====================================

  const getMeal = (item) => {
    if (item.mealId && typeof item.mealId === "object") {
      return item.mealId;
    }

    if (item.meal && typeof item.meal === "object") {
      return item.meal;
    }

    return {};
  };

  const getMealId = (item) => {
    if (item.mealId?._id) return item.mealId._id;

    if (typeof item.mealId === "string") return item.mealId;

    if (item.meal?._id) return item.meal._id;

    return "";
  };

  const getKitchenId = (item) => {
    const meal = getMeal(item);

    if (meal.kitchenId?._id) {
      return meal.kitchenId._id;
    }

    if (typeof meal.kitchenId === "string") {
      return meal.kitchenId;
    }

    return "";
  };

  const getTitle = (item) => getMeal(item).title || "Meal";

  const getPrice = (item) => {
    const meal = getMeal(item);

    return meal.price || item.price || 0;
  };

  const getImage = (item) => {
    const meal = getMeal(item);

    let image = meal.image || item.image || "";

    if (!image) {
      return "https://placehold.co/200x200?text=Meal";
    }

    image = String(image).replace(/\\/g, "/");

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const backendUrl =
      axiosInstance.defaults.baseURL?.replace(/\/api\/?$/, "") ||
      window.location.origin;

    return `${backendUrl}/${image.replace(/^\/+/, "")}`;
  };

  // =====================================
  // MULTI-KITCHEN CART CHECK
  // Backend rejects orders with meals from more
  // than one kitchen, so we warn the user up front.
  // =====================================

  const kitchenIds = useMemo(() => {
    const ids = cartItems.map((item) => getKitchenId(item)).filter(Boolean);

    return [...new Set(ids)];
  }, [cartItems]);

  const hasMultipleKitchens = kitchenIds.length > 1;

  // =====================================
  // FORM HANDLING
  // =====================================

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!address.fullName.trim()) {
      nextErrors.fullName = "Name is required";
    }

    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!address.addressLine.trim()) {
      nextErrors.addressLine = "Delivery address is required";
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      nextErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // =====================================
  // PRICE CALCULATIONS
  // =====================================

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + getPrice(item) * (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const totalQty = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cartItems]);

  const deliveryFee = cartItems.length > 0 ? 40 : 0;

  const tax = Number((subtotal * 0.05).toFixed(2));

  const grandTotal = subtotal + deliveryFee + tax;

  // =====================================
  // PLACE ORDER
  // =====================================

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (hasMultipleKitchens) {
      toast.error(
        "Your cart has meals from multiple kitchens. Please order from one kitchen at a time.",
      );

      return;
    }

    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setPlacingOrder(true);

      const payload = {
        items: cartItems.map((item) => ({
          mealId: getMealId(item),
          quantity: item.quantity || 1,
        })),

        deliveryAddress: address,

        paymentMethod,
      };

      const res = await axiosInstance.post("/order/create-order", payload);

      if (res.data.success) {
        toast.success("Order placed successfully");

        setCartCount?.(0);

        refreshCart?.();

        const orderId = res.data.data?._id;

        navigate(orderId ? `/track-order/${orderId}` : "/orders");
      } else {
        toast.error(res.data.message || "Unable to place order.");
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="checkout-page">
          <div className="checkout-container">
            <div className="checkout-top">
              <div className="skeleton skeleton-back" />

              <div className="skeleton skeleton-title" />
            </div>

            <div className="checkout-layout">
              <div className="checkout-form-col">
                <div className="skeleton skeleton-section" />

                <div className="skeleton skeleton-section" />
              </div>

              <div className="skeleton skeleton-summary" />
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =====================================
  // EMPTY CART GUARD
  // =====================================

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <motion.section
          className="checkout-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="checkout-empty-box"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <FaShoppingBag className="checkout-empty-icon" />

            <h1>Nothing to Checkout</h1>

            <p>Add some meals to your cart before checking out.</p>

            <Link to="/meal/all">
              <button className="shop-btn">Browse Meals</button>
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
        className="checkout-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="checkout-container">
          <div className="checkout-top">
            <button className="back-btn" onClick={() => navigate("/cart")}>
              <FaArrowLeft />
              Back to Cart
            </button>

            <div className="checkout-heading">
              <h1>Checkout</h1>

              <span className="checkout-subheading">
                {totalQty} {totalQty === 1 ? "item" : "items"} · secure order
                for delivery in Lucknow
              </span>
            </div>
          </div>

          {hasMultipleKitchens && (
            <div className="checkout-warning">
              Your cart has meals from multiple kitchens. Orders can only be
              placed from one kitchen at a time — please go back to your cart
              and remove items from the other kitchen.
            </div>
          )}

          <div className="checkout-layout">
            <div className="checkout-form-col">
              {/* ===== STEP 1: DELIVERY ADDRESS ===== */}

              <motion.section
                className="checkout-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="section-head">
                  <span className="step-eyebrow">01</span>

                  <FaMapMarkerAlt />

                  <h2>Delivery Address</h2>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label>Full Name</label>

                    <input
                      type="text"
                      placeholder="Your name"
                      value={address.fullName}
                      onChange={(e) =>
                        handleAddressChange("fullName", e.target.value)
                      }
                      className={errors.fullName ? "has-error" : ""}
                    />

                    {errors.fullName && (
                      <span className="field-error">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label>Phone Number</label>

                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={address.phone}
                      maxLength={10}
                      onChange={(e) =>
                        handleAddressChange(
                          "phone",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className={errors.phone ? "has-error" : ""}
                    />

                    {errors.phone && (
                      <span className="field-error">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-field span-2">
                    <label>Address</label>

                    <input
                      type="text"
                      placeholder="House no, street, area"
                      value={address.addressLine}
                      onChange={(e) =>
                        handleAddressChange("addressLine", e.target.value)
                      }
                      className={errors.addressLine ? "has-error" : ""}
                    />

                    {errors.addressLine && (
                      <span className="field-error">{errors.addressLine}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label>Landmark (optional)</label>

                    <input
                      type="text"
                      placeholder="Nearby landmark"
                      value={address.landmark}
                      onChange={(e) =>
                        handleAddressChange("landmark", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>City</label>

                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>Pincode</label>

                    <input
                      type="text"
                      placeholder="6-digit pincode"
                      value={address.pincode}
                      maxLength={6}
                      onChange={(e) =>
                        handleAddressChange(
                          "pincode",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className={errors.pincode ? "has-error" : ""}
                    />

                    {errors.pincode && (
                      <span className="field-error">{errors.pincode}</span>
                    )}
                  </div>
                </div>
              </motion.section>

              {/* ===== STEP 2: PAYMENT METHOD ===== */}

              <motion.section
                className="checkout-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
              >
                <div className="section-head">
                  <span className="step-eyebrow">02</span>

                  <FaCreditCard />

                  <h2>Payment Method</h2>
                </div>

                <div className="payment-options">
                  <button
                    type="button"
                    className={`payment-card ${
                      paymentMethod === "COD" ? "is-selected" : ""
                    }`}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <div className="payment-icon">
                      <FaMoneyBillWave />
                    </div>

                    <div className="payment-text">
                      <h3>Cash on Delivery</h3>

                      <p>Pay when your meal arrives</p>
                    </div>

                    <span className="radio-dot" />
                  </button>

                  <button
                    type="button"
                    className={`payment-card ${
                      paymentMethod === "ONLINE" ? "is-selected" : ""
                    }`}
                    onClick={() => setPaymentMethod("ONLINE")}
                  >
                    <div className="payment-icon">
                      <FaCreditCard />
                    </div>

                    <div className="payment-text">
                      <h3>Online Payment</h3>

                      <p>UPI, Card or Netbanking</p>
                    </div>

                    <span className="radio-dot" />
                  </button>
                </div>
              </motion.section>

              {/* ===== STEP 3: REVIEW ITEMS ===== */}

              <motion.section
                className="checkout-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                }}
              >
                <div className="section-head">
                  <span className="step-eyebrow">03</span>

                  <FaReceipt />

                  <h2>Review Order</h2>
                </div>

                <div className="review-list">
                  {cartItems.map((item, index) => {
                    const mealId = getMealId(item);

                    const title = getTitle(item);

                    const image = getImage(item);

                    const price = getPrice(item);

                    const qty = item.quantity || 1;

                    return (
                      <div className="review-row" key={mealId || index}>
                        <img src={image} alt={title} />

                        <div className="review-info">
                          <h4>{title}</h4>

                          <span>Qty {qty}</span>
                        </div>

                        <strong>₹{(price * qty).toFixed(0)}</strong>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            </div>

            {/* ===== ORDER SUMMARY — receipt style ===== */}

            <motion.div
              className="checkout-summary"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="ticket-stamp">
                <span>Lucknow</span>
                <span>Kitchen</span>
              </div>

              <div className="ticket-head">
                <FaReceipt />

                <h2>Payment Summary</h2>
              </div>

              <div className="summary-row">
                <span>Items ({totalQty})</span>

                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>
                  <FaTruck className="row-icon" /> Delivery Fee
                </span>

                <strong>₹{deliveryFee.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>GST (5%)</span>

                <strong>₹{tax.toFixed(2)}</strong>
              </div>

              <div className="perforation" aria-hidden="true" />

              <div className="total-row">
                <span>Grand Total</span>

                <h2>₹{grandTotal.toFixed(2)}</h2>
              </div>

              <div className="selected-payment-note">
                <FaCheckCircle />

                <span>
                  Paying via{" "}
                  {paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </span>
              </div>

              <button
                type="button"
                className="place-order-btn"
                disabled={placingOrder || hasMultipleKitchens}
                onClick={placeOrder}
              >
                {placingOrder ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <FaShoppingBag />
                    Place Order
                  </>
                )}
              </button>

              <div className="checkout-features">
                <div className="feature-item">
                  <FaShieldAlt />

                  <span>100% Secure Checkout</span>
                </div>

                <div className="feature-item">
                  <FaTruck />

                  <span>Estimated delivery in 40–50 mins</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default Checkout;
