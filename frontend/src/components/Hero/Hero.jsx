import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [searchResults, setSearchResults] = useState({
    meals: [],
    kitchens: [],
  });

  const handleSearch = () => {
    if (!query.trim()) return;

    setSearchOpen(true);
  };

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({
        meals: [],
        kitchens: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `/home/search?query=${encodeURIComponent(query.trim())}`,
        );

        const searchData = res.data?.data;

        setSearchResults({
          meals: searchData?.meals || [],
          kitchens: searchData?.kitchens || [],
        });
      } catch (error) {
        console.error("Hero Search Error:", error);

        setSearchResults({
          meals: [],
          kitchens: [],
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="hero">
      <div className="hero-inner">
        {/* Left column */}
        <div className="hero-left">
          <div className="hero-badge">HOMEMADE • HYGIENIC • DELICIOUS</div>

          <h1 className="hero-title">
            Fresh Homemade Meals
            <br />
            Delivered Across
            <br />
            <span className="hero-title-accent">
              Lucknow
              <svg
                className="squiggle"
                viewBox="0 0 220 20"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 12c8-10 16-10 24 0s16 10 24 0 16-10 24 0 16 10 24 0 16-10 24 0 16 10 24 0 16-10 24 0 16 10 24 0"
                  fill="none"
                  stroke="#f5793a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="hero-description">
            Discover delicious meals from trusted home chefs and{" "}
            <strong>local tiffin services</strong> near you in{" "}
            <strong>Gomti Nagar, Hazratganj, Chowk</strong>, and beyond.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/kitchen/all")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2v8a2 2 0 0 0 2 2v10M6 2v8m0-8v8m3-8v8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 2c-2 1.5-2 4-2 6s1 3 2 3v11"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Explore Kitchens
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/login?mode=register")}
            >
              Become a Provider
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="hero-search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="7" stroke="#b0b0b0" strokeWidth="2" />
              <path
                d="M21 21l-4.3-4.3"
                stroke="#b0b0b0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              placeholder="Search meals or kitchens..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onFocus={() => {
                if (query.trim()) {
                  setSearchOpen(true);
                }
              }}
            />

            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>

            {query.trim() && searchOpen && (
              <div className="hero-search-dropdown">
                {searchResults.meals.length > 0 && (
                  <div className="hero-search-section">
                    <div className="hero-search-heading">Meals</div>

                    {searchResults.meals.slice(0, 4).map((meal) => (
                      <div
                        key={meal._id}
                        className="hero-search-item"
                        onClick={() => navigate(`/meal/${meal._id}`)}
                      >
                        <div>
                          <strong>{meal.title}</strong>

                          <span>
                            {meal.kitchenId?.kitchenName || "Local Kitchen"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.kitchens.length > 0 && (
                  <div className="hero-search-section">
                    <div className="hero-search-heading">Kitchens</div>

                    {searchResults.kitchens.slice(0, 3).map((kitchen) => (
                      <div
                        key={kitchen._id}
                        className="hero-search-item"
                        onClick={() => navigate(`/kitchen/${kitchen._id}`)}
                      >
                        <div>
                          <strong>{kitchen.kitchenName}</strong>

                          <span>
                            {kitchen.deliveryAreas?.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.meals.length === 0 &&
                  searchResults.kitchens.length === 0 && (
                    <div className="hero-search-empty">
                      No meals or kitchens found
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="hero-trust">
            <span className="trust-item">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z"
                  stroke="#3aa15c"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#3aa15c"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              FSSAI Verified
            </span>
            <span className="trust-item">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#f5793a"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 7v5l3.5 2"
                  stroke="#f5793a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              On-Time Tiffin Delivery
            </span>
            <span className="trust-item">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21s-7-4.4-9.3-8.6C1.2 9 2.6 5.8 5.7 5.8c1.8 0 3.1 1 4.3 2.4 1.2-1.4 2.5-2.4 4.3-2.4 3.1 0 4.5 3.2 3 6.6C18.9 16.6 12 21 12 21z"
                  stroke="#e0455a"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              Low Oil &amp; Ghee
            </span>
          </div>
        </div>

        {/* Right column: orbiting dishes */}
        <div className="hero-right">
          <div className="orbit-bg" />

          <svg className="orbit-rings" viewBox="0 0 480 480">
            <circle
              cx="240"
              cy="240"
              r="230"
              fill="none"
              stroke="#f5c99a"
              strokeWidth="1"
              strokeDasharray="2 8"
              opacity="0.6"
            />
            <circle
              cx="240"
              cy="240"
              r="190"
              fill="none"
              stroke="#f5793a"
              strokeWidth="1.2"
              opacity="0.35"
            />
          </svg>

          <span className="sparkle sparkle-1">✦</span>
          <span className="sparkle sparkle-2">✦</span>
          <span className="sparkle sparkle-3">✦</span>
          <span className="sparkle sparkle-4">✦</span>
          <span className="leaf-accent leaf-1">🌿</span>
          <span className="leaf-accent leaf-2">🌿</span>

          <div className="orbit-floor" />

          <div className="orbit-center">
            <p className="orbit-center-title">100+ Homestyle Dishes</p>
            <p className="orbit-center-sub">Cooked Fresh Daily</p>
          </div>

          <div className="orbit">
            {[
              {
                name: "Paneer Thali",
                // TODO: apni real dish photo yahan daalo, e.g. import from "../assets/dishes/paneer-thali.png"
                img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop&q=80",
              },
              {
                name: "Veg Biryani",
                img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop&q=80",
              },
              {
                name: "Veg Thali",
                img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop&q=80",
              },
              {
                name: "Aloo Sabzi",
                img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop&q=80",
              },
              {
                name: "Murg Pulao",
                img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=200&h=200&fit=crop&q=80",
              },
              {
                name: "Pav Bhaji",
                img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=200&h=200&fit=crop&q=80",
              },
            ].map((dish, i) => (
              <div
                className="orbit-item"
                key={dish.name}
                style={{ "--i": i, "--total": 6 }}
              >
                <div className="orbit-plate">
                  <img src={dish.img} alt={dish.name} />
                </div>
                <span className="orbit-tooltip">{dish.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
