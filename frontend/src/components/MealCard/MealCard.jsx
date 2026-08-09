import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

export default function MealCard({ meal }) {
  const navigate = useNavigate();

  const { addToCart, addingMealId } = useCart();

  const [isFavorite, setIsFavorite] = useState(false);

  const isAdding = addingMealId === meal._id;

  // Backend field
  // IMPORTANT:
  // Do NOT visually change unavailable cards here.
  const isAvailable = meal.isAvailable !== false;

  const imageUrl = meal.image
    ? `http://localhost:4000/${meal.image.replace(/\\/g, "/")}`
    : "https://placehold.co/400x400?text=Meal";

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAdd = async (e) => {
    e.stopPropagation();

    // Unavailable meal:
    // card remains completely normal,
    // only clicking cart tells the user.
    if (!isAvailable) {
      toast.error("This meal is currently unavailable.");
      return;
    }

    try {
      const res = await addToCart(meal._id, 1);

      if (res.success) {
        toast.success("Meal added to cart");
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      toast.error("Unable to add meal to cart.");
    }
  };

  // ==========================================
  // FAVORITE
  // ==========================================

  const toggleFavorite = async (e) => {
    e.stopPropagation();

    try {
      const res = await axiosInstance.post("/favorite/add", {
        mealId: meal._id,
      });

      if (res.data.success) {
        setIsFavorite(true);

        toast.success("Added to Favorites ❤️");

        window.dispatchEvent(new Event("favoriteUpdated"));
      } else {
        toast.error(
          res.data.message || "Unable to add favorite."
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to add favorite."
      );
    }
  };

  // ==========================================
  // OPEN SINGLE MEAL
  // ==========================================

  const openMeal = () => {
    navigate(`/meal/${meal._id}`);
  };

  return (
    <div
      className="meal-card"
      onClick={openMeal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openMeal();
        }
      }}
    >
      {/* ======================================
          FAVORITE BUTTON
      ====================================== */}

      <button
        className={`meal-card-fav ${
          isFavorite ? "active" : ""
        }`}
        onClick={toggleFavorite}
        aria-label="Favourite"
        type="button"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 8 4c1.7 0 3.2.9 4 2.2C12.8 4.9 14.3 4 16 4a4.7 4.7 0 0 1 4.8 4.7Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ======================================
          MEAL IMAGE
      ====================================== */}

      <div className="meal-card-photo-wrap">
        <img
          src={imageUrl}
          alt={meal.title}
          className="meal-card-photo"
        />

        {meal.rating && (
          <span className="meal-card-rating">
            {meal.rating}

            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="#f5b400"
            >
              <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7L2.2 9.2l7.1-.6L12 2z" />
            </svg>
          </span>
        )}
      </div>

      {/* ======================================
          CARD BODY
      ====================================== */}

      <div className="meal-card-body">
        <h3 className="meal-card-name">
          {meal.title}
        </h3>

        <p className="meal-card-kitchen">
          {meal.category || "Homemade Meal"}
        </p>

        <div className="meal-card-footer">
          <div className="meal-card-left">
            {/* ==================================
                CART BUTTON
            ================================== */}

            <button
              className="meal-card-add"
              onClick={handleAdd}
              disabled={isAdding}
              aria-label={
                isAvailable
                  ? "Add to cart"
                  : "Meal currently unavailable"
              }
              type="button"
            >
              {isAdding ? (
                <span className="meal-card-add-spinner" />
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.2a2 2 0 0 0 2-1.6L20 8H6"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="9"
                    cy="21"
                    r="1.3"
                    fill="#fff"
                  />

                  <circle
                    cx="17"
                    cy="21"
                    r="1.3"
                    fill="#fff"
                  />
                </svg>
              )}
            </button>

            {/* ==================================
                VEG / NON VEG
            ================================== */}

            <div
              className={`meal-card-type ${
                meal.vegOrNonVeg?.toLowerCase() === "veg"
                  ? "veg"
                  : "nonveg"
              }`}
            >
              <span />
            </div>
          </div>

          {/* PRICE */}

          <span className="meal-card-price">
            ₹{meal.price}
          </span>
        </div>
      </div>
    </div>
  );
}