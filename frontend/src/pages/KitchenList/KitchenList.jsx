import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../utils/axiosInstance";
import "./KitchenList.css";

function SkeletonCard() {
  return (
    <div className="kitchen-card skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-line skeleton-line-lg" />
      <div className="skeleton-line skeleton-line-sm" />
    </div>
  );
}

function KitchenCard({ kitchen, index }) {
  const navigate = useNavigate();

  // Try all possible backend field names
  // so whichever exists in your model will be used.
  const kitchenName =
    kitchen.name || kitchen.title || kitchen.kitchenName || "Kitchen";

  const imageUrl = kitchen.image
    ? `http://localhost:4000/${kitchen.image.replace(/\\/g, "/")}`
    : "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&q=80";

  return (
    <div
      className="kitchen-card"
      style={{ animationDelay: `${(index % 8) * 60}ms` }}
      onClick={() => navigate(`/kitchen/${kitchen._id}`)}
    >
      <div className="kitchen-card-img-wrap">
        <img src={imageUrl} alt={kitchenName} />

        {kitchen.isOpen !== false ? (
          <span className="kitchen-badge kitchen-badge-open">Open</span>
        ) : (
          <span className="kitchen-badge kitchen-badge-closed">Closed</span>
        )}
      </div>

      <div className="kitchen-card-body">
        <div className="kitchen-card-top">
          <h3>{kitchenName}</h3>

          {kitchen.rating && (
            <span className="kitchen-rating">
              ★ {Number(kitchen.rating).toFixed(1)}
            </span>
          )}
        </div>

        <p className="kitchen-cuisine">
          {kitchen.cuisine || "Fresh Homemade Meals • Multi-Cuisine"}
        </p>

        <div className="kitchen-card-meta">
          <span>{kitchen.deliveryTime || "30-40 mins"}</span>

          <span className="dot">•</span>

          <span>{kitchen.location || kitchen.area || "Lucknow"}</span>
        </div>
      </div>

      <div className="kitchen-card-hover-cta">View Menu →</div>
    </div>
  );
}

export default function KitchenList() {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get("/kitchen/all");

        setKitchens(res.data?.data || res.data?.kitchens || res.data || []);
      } catch (err) {
        console.error(err);

        setError("Unable to load kitchens. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchKitchens();
  }, []);

  const filteredKitchens = useMemo(() => {
    if (!search.trim()) return kitchens;

    const q = search.toLowerCase();

    return kitchens.filter((k) => {
      const name = k.name || k.title || k.kitchenName || "";

      return (
        name.toLowerCase().includes(q) ||
        k.cuisine?.toLowerCase().includes(q) ||
        k.location?.toLowerCase().includes(q)
      );
    });
  }, [kitchens, search]);

  return (
    <>
      <Navbar />

      <section className="kitchen-list-hero">
        <span className="kitchen-list-tag">✦ All Kitchens</span>

        <h1>
          Discover the Best <span>Home Kitchens</span> Near You
        </h1>

        <p>
          Real chefs, freshly prepared meals — explore kitchens and discover
          what's cooking today.
        </p>

        <div className="kitchen-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="kitchen-list-section">
        {error && <div className="kitchen-error">{error}</div>}

        {loading ? (
          <div className="kitchen-grid">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : filteredKitchens.length === 0 ? (
          <div className="kitchen-empty">
            <p>No kitchens found 🍽️</p>
          </div>
        ) : (
          <div className="kitchen-grid">
            {filteredKitchens.map((kitchen, i) => (
              <KitchenCard key={kitchen._id} kitchen={kitchen} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
