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

function Favorites() {
  const navigate = useNavigate();

  const { addToCart, addingMealId } = useCart();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/favorite/my-favorites");

      if (res.data.success) {
        setFavorites(res.data.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to load favorites.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      const res = await axiosInstance.delete(`/favorite/remove/${favoriteId}`);

      if (res.data.success) {
        toast.success("Removed from Favorites ❤️");

        setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Unable to remove favorite.");
    }
  };

  const handleAddCart = async (mealId) => {
    const res = await addToCart(mealId, 1);

    if (res.success) {
      toast.success("Meal added to cart.");
    } else {
      toast.error(res.message);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="favorite-loading">Loading Favorites...</div>

        <Footer />
      </>
    );
  }

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
          <motion.div
            className="favorites-hero"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1>
              My <span>Favorites</span>
            </h1>

            <p>Your saved meals are waiting for you ❤️</p>
          </motion.div>

          {favorites.length === 0 ? (
            <motion.div
              className="favorites-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaHeart className="empty-heart" />

              <h2>No Favorites Yet</h2>

              <p>Save your favourite meals and they will appear here.</p>

              <button onClick={() => navigate("/meal/all")}>
                Browse Meals
              </button>
            </motion.div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((item) => {
                const meal = item.mealId;

                const imageUrl = meal?.image
                  ? `http://localhost:4000/${meal.image.replace(/\\/g, "/")}`
                  : "https://placehold.co/500x500?text=Meal";

                return (
                  <motion.div
                    key={item._id}
                    className="favorite-card"
                    whileHover={{
                      y: -8,
                    }}
                  >
                    <button
                      className="remove-favorite"
                      onClick={() => removeFavorite(item._id)}
                    >
                      <FaHeart />
                    </button>

                    <img
                      src={imageUrl}
                      alt={meal.title}
                      onClick={() => navigate(`/meal/${meal._id}`)}
                    />

                    <div className="favorite-body">
                      <div
                        className={`meal-badge ${
                          meal.vegOrNonVeg === "veg" ? "veg" : "nonveg"
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

                      <h3>{meal.title}</h3>

                      <p>{meal.category}</p>

                      <h2>₹{meal.price}</h2>

                      <button
                        className="favorite-cart-btn"
                        onClick={() => handleAddCart(meal._id)}
                        disabled={addingMealId === meal._id}
                      >
                        <FaShoppingCart />

                        {addingMealId === meal._id
                          ? "Adding..."
                          : "Add To Cart"}
                      </button>

                      <button
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
