import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";

import MealCard from "../MealCard/MealCard";
import "./FeaturedMeals.css";

export default function FeaturedMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  // ================= Scroll reveal (in on scroll-down, out on scroll-up) =================
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Entering viewport -> reveal animation plays.
        // Leaving viewport (either direction) -> section resets so it
        // animates in again next time it's scrolled back into view.
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // ================= Fetch Featured Meals =================
  useEffect(() => {
    const controller = new AbortController();

    const fetchMeals = async () => {
      try {
        setLoading(true);
        setHasError(false);

        const res = await axiosInstance.get("/home/featured-meals", {
          signal: controller.signal,
        });

        setMeals(res.data.data || []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Featured Meals Error:", err);
          setHasError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();

    return () => controller.abort();
  }, []);

  // ================= Responsive Cards =================
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth <= 600) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 900) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // Don't stretch slides across an empty 3-card grid when there are
  // fewer meals than cardsPerView — size slides to what's actually there.
  const effectiveCardsPerView = Math.max(
    1,
    Math.min(cardsPerView, meals.length || cardsPerView),
  );

  const maxIndex = Math.max(0, meals.length - effectiveCardsPerView);

  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const scrollToIndex = (index) => {
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(newIndex);
  };

  const showArrows = meals.length > effectiveCardsPerView;

  return (
    <section
      className={`featured-meals ${isInView ? "in-view" : ""}`}
      ref={sectionRef}
    >
      <div className="featured-meals-inner">
        <div className="featured-meals-header">
          <span className="featured-meals-tag">🍽 Curated For You</span>
          <h2 className="featured-meals-title">
            Featured <span>Meals</span>
          </h2>
          <p className="featured-meals-eyebrow">
            All our best plates in one delicious snap
          </p>
        </div>

        <div className="featured-meals-carousel">
          {showArrows && (
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous meals"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div className="carousel-viewport">
            {loading && (
              <div className="carousel-track carousel-track-center">
                {[1, 2, 3].map((item, i) => (
                  <div
                    key={item}
                    className="meal-card meal-card-skeleton"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-line skeleton-w60"></div>
                    <div className="skeleton-line skeleton-w80"></div>
                    <div className="skeleton-line skeleton-w40"></div>
                  </div>
                ))}
              </div>
            )}

            {!loading && hasError && (
              <div className="featured-meals-empty">
                <span className="featured-meals-empty-icon">⚠️</span>
                Couldn't load meals right now.
              </div>
            )}

            {!loading && !hasError && meals.length === 0 && (
              <div className="featured-meals-empty">
                <span className="featured-meals-empty-icon">🍽️</span>
                No meals available at the moment.
              </div>
            )}

            {!loading && !hasError && meals.length > 0 && (
              <div
                className={`carousel-track ${
                  meals.length <= effectiveCardsPerView
                    ? "carousel-track-center"
                    : ""
                }`}
                ref={trackRef}
                style={{
                  transform: `translateX(-${
                    activeIndex * (100 / effectiveCardsPerView)
                  }%)`,
                }}
              >
                {meals.map((meal, i) => (
                  <div
                    className="carousel-slide"
                    key={meal._id}
                    style={{
                      flex: `0 0 calc((100% - ${
                        (effectiveCardsPerView - 1) * 28
                      }px) / ${effectiveCardsPerView})`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <MealCard meal={meal} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {showArrows && (
            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex >= maxIndex}
              aria-label="Next meals"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
