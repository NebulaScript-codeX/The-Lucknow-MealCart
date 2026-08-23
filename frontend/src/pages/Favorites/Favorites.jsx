import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

import {
  FaHeart,
  FaShoppingCart,
  FaArrowRight,
  FaLeaf,
  FaDrumstickBite,
} from "react-icons/fa";

import "./Favorites.css";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image) {
    return "https://placehold.co/500x500?text=Meal";
  }

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Get backend base URL from axiosInstance
  const baseURL = axiosInstance.defaults.baseURL || "";

  const cleanImage = image.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${baseURL.replace(/\/+$/, "")}/${cleanImage}`;
};

// =====================================================
// COMPONENT
// =====================================================

function Favorites() {
  const navigate = useNavigate();

  const { addToCart, addingMealId } = useCart();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // FETCH FAVORITES
  // ===================================================

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/favorite/my-favorites");

      if (res.data?.success) {
        setFavorites(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        setFavorites([]);
        toast.error(res.data?.message || "Unable to load favorites.");
      }
    } catch (err) {
      console.error("Favorites Fetch Error:", err);

      toast.error(err.response?.data?.message || "Unable to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // REMOVE FAVORITE
  // ===================================================

  const removeFavorite = async (favoriteId) => {
    try {
      const res = await axiosInstance.delete(`/favorite/remove/${favoriteId}`);

      if (res.data?.success) {
        toast.success("Removed from Favorites ❤️");

        setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
      } else {
        toast.error(res.data?.message || "Unable to remove favorite.");
      }
    } catch (err) {
      console.error("Remove Favorite Error:", err);

      toast.error(err.response?.data?.message || "Unable to remove favorite.");
    }
  };

  // ===================================================
  // ADD TO CART
  // ===================================================

  const handleAddCart = async (mealId) => {
    try {
      const res = await addToCart(mealId, 1);

      if (res?.success) {
        toast.success("Meal added to cart.");
      } else {
        toast.error(res?.message || "Unable to add meal to cart.");
      }
    } catch (err) {
      console.error("Add To Cart Error:", err);

      toast.error("Unable to add meal to cart.");
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="favorite-loading">
          <div>
            <div className="favorite-loading-spinner" />
            <p>Loading Favorites...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <>
      <Navbar />

      <motion.section
        className="favorites-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="favorites-container">
          {/* ==========================================
              HERO
          ========================================== */}

          <motion.div
            className="favorites-hero"
            initial={{
              y: 40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <h1>
              My <span>Favorites</span>
            </h1>

            <p>Your saved meals are waiting for you ❤️</p>
          </motion.div>

          {/* ==========================================
              EMPTY STATE
          ========================================== */}

          {favorites.length === 0 ? (
            <motion.div
              className="favorites-empty"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <FaHeart className="empty-heart" />

              <h2>No Favorites Yet</h2>

              <p>Save your favourite meals and they will appear here.</p>

              <button type="button" onClick={() => navigate("/meal/all")}>
                Browse Meals
                <FaArrowRight />
              </button>
            </motion.div>
          ) : (
            /* ==========================================
                FAVORITES GRID
            ========================================== */

            <div className="favorites-grid">
              {favorites.map((item, index) => {
                const meal = item?.mealId;

                // Safety check
                if (!meal) {
                  return null;
                }

                const imageUrl = getImageUrl(meal.image);

                const isVeg = meal.vegOrNonVeg?.toLowerCase() === "veg";

                return (
                  <motion.div
                    key={item._id}
                    className="favorite-card"
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.07,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                  >
                    {/* REMOVE FAVORITE */}

                    <button
                      type="button"
                      className="remove-favorite"
                      onClick={() => removeFavorite(item._id)}
                      aria-label="Remove from favorites"
                    >
                      <FaHeart />
                    </button>

                    {/* MEAL IMAGE */}

                    <img
                      src={imageUrl}
                      alt={meal.title || "Meal"}
                      onClick={() => navigate(`/meal/${meal._id}`)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/500x500?text=Meal";
                      }}
                    />

                    {/* CARD BODY */}

                    <div className="favorite-body">
                      {/* VEG / NON-VEG BADGE */}

                      <div className={`meal-badge ${isVeg ? "veg" : "nonveg"}`}>
                        {isVeg ? (
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

                      {/* TITLE */}

                      <h3>{meal.title || "Delicious Meal"}</h3>

                      {/* CATEGORY */}

                      <p>{meal.category || "Homestyle Meal"}</p>

                      {/* PRICE */}

                      <h2>
                        ₹{Number(meal.price || 0).toLocaleString("en-IN")}
                      </h2>

                      {/* ADD TO CART */}

                      <button
                        type="button"
                        className="favorite-cart-btn"
                        onClick={() => handleAddCart(meal._id)}
                        disabled={addingMealId === meal._id}
                      >
                        <FaShoppingCart />

                        {addingMealId === meal._id
                          ? "Adding..."
                          : "Add To Cart"}
                      </button>

                      {/* VIEW MEAL */}

                      <button
                        type="button"
                        className="favorite-view-btn"
                        onClick={() => navigate(`/meal/${meal._id}`)}
                      >
                        View Meal
                        <FaArrowRight />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

export default Favorites;
