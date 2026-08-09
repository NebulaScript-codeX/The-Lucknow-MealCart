import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MealCard from "../../components/MealCard/MealCard";

import axiosInstance from "../../utils/axiosInstance";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaHeart,
  FaMinus,
  FaPlus,
  FaLeaf,
  FaDrumstickBite,
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaStore,
  FaFire,
  FaTruck,
  FaUtensils,
  FaBan,
} from "react-icons/fa";

import "./SingleMeal.css";

function SingleMeal() {
  const { mealId } = useParams();
  const navigate = useNavigate();

  const { addToCart, addingMealId } = useCart();
  const { user } = useAuth();

  const [meal, setMeal] = useState(null);
  const [similarMeals, setSimilarMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const imageUrl = meal?.image
    ? `http://localhost:4000/${meal.image.replace(/\\/g, "/")}`
    : "https://placehold.co/700x700?text=Meal";

  // IMPORTANT:
  // Backend Meal model uses "isAvailable"
  const isAvailable = meal?.isAvailable !== false;

  useEffect(() => {
    fetchMeal();
  }, [mealId]);

  const fetchMeal = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`/meal/${mealId}`);

      if (res.data.success) {
        const mealData = res.data.data;

        setMeal(mealData);

        if (mealData.category) {
          fetchSimilar(mealData.category);
        }
      } else {
        toast.error(res.data.message || "Unable to load meal.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to load meal.");
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please login to add favorites.");
      navigate("/login");
      return;
    }

    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      const res = await axiosInstance.post("/favorite/add", {
        mealId: meal._id,
      });

      if (res.data.success) {
        setFavorite(true);
        toast.success("Meal added to Favorites ❤️");

        window.dispatchEvent(new Event("favoriteUpdated"));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to add favorite."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  const fetchSimilar = async (category) => {
    try {
      const res = await axiosInstance.get("/meal/all");

      const meals = res.data.data || res.data.meals || [];

      const filtered = meals.filter(
        (m) => m.category === category && m._id !== mealId
      );

      setSimilarMeals(filtered.slice(0, 4));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddCart = async () => {
    if (!isAvailable) {
      toast.error("This meal is currently unavailable.");
      return;
    }

    const res = await addToCart(meal._id, qty);

    if (res.success) {
      toast.success("Meal added to cart");
    } else {
      toast.error(res.message || "Unable to add meal to cart.");
    }
  };

  const increaseQty = () => {
    if (!isAvailable) return;

    setQty((q) => q + 1);
  };

  const decreaseQty = () => {
    if (!isAvailable) return;

    setQty((q) => Math.max(1, q - 1));
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="single-loading">
          Loading Meal...
        </div>

        <Footer />
      </>
    );
  }

  if (!meal) {
    return (
      <>
        <Navbar />

        <div className="single-loading">
          Meal not found.
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <motion.section
        className="single-meal-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="single-container">

          {/* Back Button */}
          <motion.button
            className="single-back"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back
          </motion.button>

          {/* Main Meal Card */}
          <motion.div
            className={`single-card ${
              !isAvailable ? "single-meal-unavailable" : ""
            }`}
            initial={{
              opacity: 0,
              y: 60,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            {/* ==============================
                LEFT IMAGE SECTION
            ============================== */}

            <motion.div
              className="single-image-section"
              whileHover={
                isAvailable
                  ? {
                      rotateX: 6,
                      rotateY: -6,
                      scale: 1.02,
                    }
                  : {}
              }
            >
              {/* Unavailable Ribbon */}
              {!isAvailable && (
                <div className="single-unavailable-ribbon">
                  <span>
                    <FaBan />
                    UNAVAILABLE
                  </span>
                </div>
              )}

              {/* Favourite */}
              <button
                className={`single-fav ${
                  favorite ? "active" : ""
                }`}
                onClick={handleFavorite}
                disabled={favoriteLoading}
              >
                <FaHeart />
              </button>

              <div className="image-glow"></div>

              <div className="single-image-wrap">
                <div className="image-shine"></div>

                <motion.img
                  src={imageUrl}
                  alt={meal.title}
                  className="single-image"
                  initial={{
                    scale: 0.9,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                />

                {/* Image overlay for unavailable */}
                {!isAvailable && (
                  <div className="single-image-unavailable-overlay">
                    <FaBan />
                    <span>Currently Unavailable</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ==============================
                RIGHT CONTENT
            ============================== */}

            <motion.div
              className="single-content"
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
              }}
            >

              <div className="single-top">

                {/* Veg / Non Veg */}
                <div
                  className={`single-type ${
                    meal.vegOrNonVeg === "veg"
                      ? "veg"
                      : "nonveg"
                  }`}
                >
                  {meal.vegOrNonVeg === "veg" ? (
                    <>
                      <FaLeaf />
                      Veg
                    </>
                  ) : (
                    <>
                      <FaDrumstickBite />
                      Non Veg
                    </>
                  )}
                </div>

                {/* Availability */}
                <div
                  className={`single-available ${
                    !isAvailable ? "unavailable" : ""
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <FaCheckCircle />
                      Available
                    </>
                  ) : (
                    <>
                      <FaBan />
                      Unavailable
                    </>
                  )}
                </div>

              </div>

              <h1>{meal.title}</h1>

              <div className="single-category">
                <FaUtensils />
                {meal.category || "Homemade Meal"}
              </div>

              <p className="single-description">
                {meal.description}
              </p>

              {/* Price */}
              <div className="price-card">
                <span>Today's Price</span>

                <h2>₹{meal.price}</h2>

                <small>
                  {isAvailable
                    ? "Freshly Prepared Today"
                    : "Currently Unavailable"}
                </small>
              </div>

              {/* Meta Information */}
              <div className="meal-meta-grid">

                <div className="meta-item">
                  <FaFire />

                  <div>
                    <span>Meal Type</span>
                    <strong>
                      {meal.mealType || "Homemade"}
                    </strong>
                  </div>
                </div>

                <div className="meta-item">
                  <FaClock />

                  <div>
                    <span>Delivery</span>
                    <strong>30-40 mins</strong>
                  </div>
                </div>

                <div className="meta-item">
                  <FaTruck />

                  <div>
                    <span>Availability</span>
                    <strong>
                      {isAvailable
                        ? `${meal.quantityAvailable ?? 0} Left`
                        : "Unavailable"}
                    </strong>
                  </div>
                </div>

                <div className="meta-item">
                  <FaStore />

                  <div>
                    <span>Kitchen</span>
                    <strong>Coming Soon</strong>
                  </div>
                </div>

              </div>

              {/* Quantity + Cart */}
              <div className="quantity-cart-wrapper">

                <div
                  className={`single-quantity ${
                    !isAvailable ? "quantity-disabled" : ""
                  }`}
                >
                  <button
                    onClick={decreaseQty}
                    disabled={!isAvailable}
                  >
                    <FaMinus />
                  </button>

                  <span>{qty}</span>

                  <button
                    onClick={increaseQty}
                    disabled={!isAvailable}
                  >
                    <FaPlus />
                  </button>
                </div>

                <motion.button
                  className={`single-cart-btn ${
                    !isAvailable ? "cart-unavailable" : ""
                  }`}
                  whileHover={
                    isAvailable
                      ? {
                          scale: 1.03,
                          y: -3,
                        }
                      : {}
                  }
                  whileTap={
                    isAvailable
                      ? {
                          scale: 0.96,
                        }
                      : {}
                  }
                  onClick={handleAddCart}
                  disabled={
                    !isAvailable ||
                    addingMealId === meal._id
                  }
                >
                  {isAvailable ? (
                    <>
                      <FaShoppingCart />

                      {addingMealId === meal._id
                        ? "Adding..."
                        : "Add To Cart"}
                    </>
                  ) : (
                    <>
                      <FaBan />
                      Unavailable
                    </>
                  )}
                </motion.button>

              </div>

              {/* Highlights */}
              <div className="meal-highlights">

                <div className="highlight-card">
                  <FaFire />
                  <span>Chef Special</span>
                </div>

                <div className="highlight-card">
                  <FaLeaf />
                  <span>Fresh Ingredients</span>
                </div>

                <div className="highlight-card">
                  <FaClock />
                  <span>Prepared Today</span>
                </div>

              </div>

            </motion.div>
          </motion.div>

          {/* ==============================
              SIMILAR MEALS
          ============================== */}

          {similarMeals.length > 0 && (
            <motion.div
              className="similar-section"
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <div className="section-heading">
                <h2>Similar Meals</h2>

                <p>
                  You may also like these delicious meals
                </p>
              </div>

              <div className="similar-grid">
                {similarMeals.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{
                      y: -8,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                  >
                    <MealCard meal={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </motion.section>

      <Footer />
    </>
  );
}

export default SingleMeal;