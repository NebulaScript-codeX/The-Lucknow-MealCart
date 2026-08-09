import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaArrowLeft,
  FaUtensils,
  FaReceipt,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const { setCartCount, refreshCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [busyId, setBusyId] = useState(null);

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

      const totalQty = items.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0,
      );

      setCartCount?.(totalQty);
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

  const getTitle = (item) => {
    const meal = getMeal(item);

    return meal.title || "Meal";
  };

  const getPrice = (item) => {
    const meal = getMeal(item);

    return meal.price || item.price || 0;
  };

  const getImage = (item) => {
    const meal = getMeal(item);

    let image = meal.image || item.image || "";

    if (!image) {
      return "https://placehold.co/600x400?text=Meal";
    }

    image = image.replace(/\\/g, "/");

    if (!image.startsWith("http")) {
      image = `http://localhost:4000/${image}`;
    }

    return image;
  };

  // =====================================
  // UPDATE QUANTITY
  // =====================================

  const updateQuantity = async (mealId, quantity) => {
    try {
      setUpdating(true);
      setBusyId(mealId);

      const res = await axiosInstance.put(`/cart/update/${mealId}`, {
        quantity,
      });

      if (res.data.success) {
        await fetchCart();

        refreshCart?.();
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Unable to update quantity.");
    } finally {
      setUpdating(false);
      setBusyId(null);
    }
  };

  const increaseQty = (mealId, quantity) => {
    if (!mealId) {
      toast.error("Meal Id Missing");
      return;
    }

    updateQuantity(mealId, quantity + 1);
  };

  const decreaseQty = (mealId, quantity) => {
    if (!mealId) {
      toast.error("Meal Id Missing");
      return;
    }

    if (quantity <= 1) {
      removeItem(mealId);
      return;
    }

    updateQuantity(mealId, quantity - 1);
  };

  // =====================================
  // REMOVE ITEM
  // =====================================

  const removeItem = async (mealId) => {
    try {
      if (!mealId) {
        toast.error("Meal Id Missing");
        return;
      }

      setUpdating(true);
      setBusyId(mealId);

      const res = await axiosInstance.delete(`/cart/remove/${mealId}`);

      if (res.data.success) {
        toast.success("Item removed from cart");

        await fetchCart();

        refreshCart?.();
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Unable to remove item.");
    } finally {
      setUpdating(false);
      setBusyId(null);
    }
  };

  // =====================================
  // CLEAR CART
  // =====================================

  const clearCart = async () => {
    try {
      setUpdating(true);

      const res = await axiosInstance.delete("/cart/clear");

      if (res.data.success) {
        toast.success("Cart cleared");

        setCartItems([]);

        setCartCount?.(0);

        refreshCart?.();
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Unable to clear cart.");
    } finally {
      setUpdating(false);
    }
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
  // LOADING UI (skeleton)
  // =====================================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="cart-page">
          <div className="cart-container">
            <div className="cart-top">
              <div className="skeleton skeleton-back" />
              <div className="skeleton skeleton-title" />
            </div>

            <div className="cart-layout">
              <div className="cart-items">
                {[1, 2, 3].map((n) => (
                  <div className="skeleton-card" key={n}>
                    <div className="skeleton skeleton-img" />
                    <div className="skeleton-lines">
                      <div className="skeleton skeleton-line w-60" />
                      <div className="skeleton skeleton-line w-30" />
                      <div className="skeleton skeleton-line w-40" />
                    </div>
                  </div>
                ))}
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
  // EMPTY CART
  // =====================================

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <motion.section
          className="empty-cart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="empty-cart-box"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="dabba">
              <div className="dabba-lid" />
              <div className="dabba-body">
                <FaUtensils className="dabba-icon" />
              </div>
            </div>

            <h1>Your Cart is Empty</h1>

            <p>Looks like you haven't added any meals to your cart yet.</p>

            <Link to="/meal/all">
              <button className="shop-btn">
                <FaUtensils />
                Browse Meals
              </button>
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
        className="cart-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="cart-container">
          <div className="cart-top">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
              Back
            </button>

            <div className="cart-heading">
              <h1>Your Cart</h1>
              <span className="cart-subheading">
                {totalQty} {totalQty === 1 ? "item" : "items"} from your
                favourite kitchens
              </span>
            </div>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              <AnimatePresence initial={false}>
                {cartItems.map((item, index) => {
                  const mealId = getMealId(item);

                  const title = getTitle(item);

                  const image = getImage(item);

                  const price = getPrice(item);

                  const itemBusy = updating && busyId === mealId;

                  return (
                    <motion.div
                      key={mealId || index}
                      className={`cart-card ${itemBusy ? "is-busy" : ""}`}
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: -60,
                        scale: 0.94,
                        transition: { duration: 0.28 },
                      }}
                      transition={{ delay: index * 0.06, duration: 0.4 }}
                    >
                      <div className="cart-img-wrap">
                        <img src={image} alt={title} className="cart-img" />
                      </div>

                      <div className="cart-details">
                        <h2>{title}</h2>

                        <p className="unit-price">
                          ₹{price} <span>/ plate</span>
                        </p>

                        <div className="quantity-control">
                          <button
                            type="button"
                            className="qty-btn minus-btn"
                            disabled={updating}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              decreaseQty(mealId, item.quantity);
                            }}
                          >
                            <FaMinus />
                          </button>

                          <span className="qty-value">{item.quantity}</span>

                          <button
                            type="button"
                            className="qty-btn plus-btn"
                            disabled={updating}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              increaseQty(mealId, item.quantity);
                            }}
                          >
                            <FaPlus />
                          </button>

                          <button
                            type="button"
                            className="qty-btn delete-btn"
                            disabled={updating}
                            title="Remove item"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeItem(mealId);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="cart-line-total">
                        <span className="line-total-label">Total</span>
                        <h3>₹{(price * (item.quantity || 1)).toFixed(0)}</h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* =========================
                ORDER SUMMARY — receipt style
            ========================== */}

            <motion.div
              className="cart-summary"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ticket-stamp">
                <span>Lucknow</span>
                <span>Kitchen</span>
              </div>

              <div className="ticket-head">
                <FaReceipt />
                <h2>Order Summary</h2>
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

              <button
                type="button"
                className="checkout-btn"
                disabled={updating}
                onClick={() => navigate("/checkout")}
              >
                <FaShoppingBag />
                Proceed To Checkout
              </button>

              <button
                type="button"
                className="clear-btn"
                disabled={updating}
                onClick={clearCart}
              >
                <FaTrash />
                Clear Cart
              </button>

              <div className="cart-features">
                <div className="feature-item">
                  <FaUtensils />
                  <span>Fresh Homemade Meals</span>
                </div>
                <div className="feature-item">
                  <FaTruck />
                  <span>Fast Local Delivery</span>
                </div>
                <div className="feature-item">
                  <FaShieldAlt />
                  <span>Secure Payments</span>
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

export default Cart;
