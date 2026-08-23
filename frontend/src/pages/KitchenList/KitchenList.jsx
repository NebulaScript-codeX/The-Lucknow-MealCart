import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";

import "./KitchenList.css";

// =====================================================
// IMAGE HELPER
// =====================================================

const getImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&q=80";
  }

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Normalize Windows path
  const normalizedPath = image.replace(/\\/g, "/");

  // Get backend base URL from axiosInstance
  const baseURL = axiosInstance.defaults?.baseURL || "";

  // Remove trailing slash from base URL
  const cleanBaseURL = baseURL.replace(/\/+$/, "");

  // Remove leading slash from image path
  const cleanImagePath = normalizedPath.replace(/^\/+/, "");

  return `${cleanBaseURL}/${cleanImagePath}`;
};

// =====================================================
// SKELETON CARD
// =====================================================

function SkeletonCard() {
  return (
    <div className="kitchen-card skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-line skeleton-line-lg" />
      <div className="skeleton-line skeleton-line-sm" />
    </div>
  );
}

// =====================================================
// KITCHEN CARD
// =====================================================

function KitchenCard({ kitchen, index }) {
  const navigate = useNavigate();

  const kitchenName =
    kitchen?.name || kitchen?.title || kitchen?.kitchenName || "Kitchen";

  const imageUrl = getImageUrl(kitchen?.image);

  const rating =
    kitchen?.rating !== undefined && kitchen?.rating !== null
      ? Number(kitchen.rating)
      : null;

  const cuisine = kitchen?.cuisine || "Fresh Homemade Meals • Multi-Cuisine";

  const deliveryTime = kitchen?.deliveryTime || "30-40 mins";

  const location = kitchen?.location || kitchen?.area || "Lucknow";

  const isOpen = kitchen?.isOpen !== false;

  const handleKitchenClick = () => {
    if (kitchen?._id) {
      navigate(`/kitchen/${kitchen._id}`);
    }
  };

  return (
    <div
      className="kitchen-card"
      style={{
        animationDelay: `${(index % 8) * 60}ms`,
      }}
      onClick={handleKitchenClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleKitchenClick();
        }
      }}
    >
      {/* IMAGE */}
      <div className="kitchen-card-img-wrap">
        <img
          src={imageUrl}
          alt={kitchenName}
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&q=80";
          }}
        />

        {isOpen ? (
          <span className="kitchen-badge kitchen-badge-open">Open</span>
        ) : (
          <span className="kitchen-badge kitchen-badge-closed">Closed</span>
        )}
      </div>

      {/* CONTENT */}
      <div className="kitchen-card-body">
        <div className="kitchen-card-top">
          <h3>{kitchenName}</h3>

          {rating !== null && !Number.isNaN(rating) && (
            <span className="kitchen-rating">★ {rating.toFixed(1)}</span>
          )}
        </div>

        <p className="kitchen-cuisine">{cuisine}</p>

        <div className="kitchen-card-meta">
          <span>{deliveryTime}</span>

          <span className="dot">•</span>

          <span>{location}</span>
        </div>
      </div>

      {/* HOVER CTA */}
      <div className="kitchen-card-hover-cta">View Menu →</div>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function KitchenList() {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ===================================================
  // FETCH KITCHENS
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const fetchKitchens = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosInstance.get("/kitchen/all");

        console.log("Kitchen API Response:", res.data);

        const responseData = res.data;

        let kitchenData = [];

        if (Array.isArray(responseData)) {
          kitchenData = responseData;
        } else if (Array.isArray(responseData?.data)) {
          kitchenData = responseData.data;
        } else if (Array.isArray(responseData?.kitchens)) {
          kitchenData = responseData.kitchens;
        } else if (Array.isArray(responseData?.data?.kitchens)) {
          kitchenData = responseData.data.kitchens;
        }

        if (mounted) {
          setKitchens(kitchenData);
        }
      } catch (err) {
        console.error("Fetch Kitchens Error:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "Unable to load kitchens. Please try again later.",
          );

          setKitchens([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchKitchens();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // SEARCH FILTER
  // ===================================================

  const filteredKitchens = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return kitchens;
    }

    return kitchens.filter((kitchen) => {
      const name = String(
        kitchen?.name || kitchen?.title || kitchen?.kitchenName || "",
      ).toLowerCase();

      const cuisine = String(kitchen?.cuisine || "").toLowerCase();

      const location = String(
        kitchen?.location || kitchen?.area || "",
      ).toLowerCase();

      return (
        name.includes(query) ||
        cuisine.includes(query) ||
        location.includes(query)
      );
    });
  }, [kitchens, search]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      <Navbar />

      {/* =================================================
          HERO
      ================================================= */}

      <section className="kitchen-list-hero">
        <span className="kitchen-list-tag">✦ All Kitchens</span>

        <h1>
          Discover the Best <span>Home Kitchens</span> Near You
        </h1>

        <p>
          Real chefs, freshly prepared meals — explore kitchens and discover
          what's cooking today.
        </p>

        {/* SEARCH */}
        <div className="kitchen-search-bar">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M21 21l-4.3-4.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Search kitchens, cuisines or locations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ×
            </button>
          )}
        </div>
      </section>

      {/* =================================================
          KITCHEN LIST
      ================================================= */}

      <section className="kitchen-list-section">
        {/* ERROR */}
        {error && <div className="kitchen-error">{error}</div>}

        {/* LOADING */}
        {loading ? (
          <div className="kitchen-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredKitchens.length === 0 ? (
          /* EMPTY */
          <div className="kitchen-empty">
            <p>
              {search
                ? `No kitchens found for "${search}" 🍽️`
                : "No kitchens available right now 🍽️"}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                style={{
                  marginTop: "12px",
                  cursor: "pointer",
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* RESULTS */
          <div className="kitchen-grid">
            {filteredKitchens.map((kitchen, index) => (
              <KitchenCard
                key={kitchen?._id || index}
                kitchen={kitchen}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
