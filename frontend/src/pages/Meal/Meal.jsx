import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MealCard from "../../components/MealCard/MealCard";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaLeaf,
  FaDrumstickBite,
  FaMoneyBillWave,
} from "react-icons/fa";
import "./Meal.css";

/* =========================
   Skeleton Card
========================= */

function SkeletonCard() {
  return (
    <div className="meal-card meal-card-skeleton">
      <div className="skeleton-circle"></div>

      <div className="skeleton-line skeleton-w80"></div>

      <div className="skeleton-line skeleton-w60"></div>

      <div className="skeleton-line skeleton-w40"></div>
    </div>
  );
}

export default function Meal() {
  const [meals, setMeals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  /* =========================
      Fetch Meals
  ========================= */

  const fetchMeals = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/meal/all");

      if (res.data.success) {
        setMeals(res.data.meals || []);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error("Unable to fetch meals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  /* =========================
      Filters
  ========================= */

  const filteredMeals = useMemo(() => {
    let filtered = [...meals];

    // Search

    if (search.trim()) {
      filtered = filtered.filter((meal) =>
        meal.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Veg

    if (activeFilter === "veg") {
      filtered = filtered.filter(
        (meal) => meal.vegOrNonVeg && meal.vegOrNonVeg.toLowerCase() === "veg",
      );
    }

    // Non Veg

    if (activeFilter === "nonveg") {
      filtered = filtered.filter(
        (meal) =>
          meal.vegOrNonVeg && meal.vegOrNonVeg.toLowerCase() === "non-veg",
      );
    }

    // Under ₹200

    if (activeFilter === "under200") {
      filtered = filtered.filter((meal) => Number(meal.price) <= 200);
    }

    return filtered;
  }, [meals, search, activeFilter]);

  return (
    <>
      <Navbar />

      <section className="meal-page">
        {/* Background Blobs */}

        <div className="meal-bg blob1"></div>

        <div className="meal-bg blob2"></div>

        <div className="meal-container">
          {/* =====================
                Hero
          ====================== */}

          <div className="meal-header">
            <span className="meal-tag">🍽 Fresh Homemade Meals</span>

            <h1>
              Browse <span>Delicious Meals</span>
            </h1>

            <p>
              Freshly cooked meals prepared by trusted home kitchens. Search
              your favourite dishes and order instantly.
            </p>
          </div>

          {/* =====================
                Search
          ====================== */}

          <div className="meal-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search meals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* =====================
                Filters
          ====================== */}

          <div className="meal-filters">
            <button
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>

            <button
              className={activeFilter === "veg" ? "active" : ""}
              onClick={() => setActiveFilter("veg")}
            >
              <FaLeaf />
              Veg
            </button>

            <button
              className={activeFilter === "nonveg" ? "active" : ""}
              onClick={() => setActiveFilter("nonveg")}
            >
              <FaDrumstickBite />
              Non Veg
            </button>

            <button
              className={activeFilter === "under200" ? "active" : ""}
              onClick={() => setActiveFilter("under200")}
            >
              <FaMoneyBillWave />
              Under ₹200
            </button>
          </div>

          {/* =====================
               Meal Count
          ====================== */}

          <div className="meal-count">
            Showing
            <span> {filteredMeals.length}</span> Meals
          </div>
          {/* =====================
                Meals Grid
          ====================== */}

          {loading ? (
            <div className="meal-grid">
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredMeals.length > 0 ? (
            <div className="meal-grid">
              {filteredMeals.map((meal) => (
                <MealCard key={meal._id} meal={meal} />
              ))}
            </div>
          ) : (
            <div className="meal-empty">
              <div className="meal-empty-icon">🍽</div>

              <h2>No Meals Found</h2>

              <p>
                We couldn't find any meals matching your search or selected
                filters.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
