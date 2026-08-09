import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiPackage, FiCreditCard, FiLogOut } from "react-icons/fi";

const ZONES = [
  "All Lucknow",
  "Gomti Nagar",
  "Hazratganj",
  "Indira Nagar",
  "Alambagh",
  "Chowk",
  "Mahanagar",
  "Rajajipuram",
  "Janki Puram",
  "Ashiyana",
];

export default function Navbar() {
  const [zone, setZone] = useState("All Lucknow");
  const [search, setSearch] = useState("");
  const [isZoneOpen, setIsZoneOpen] = useState(false);

  const zoneRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const [searchResults, setSearchResults] = useState({
    meals: [],
    kitchens: [],
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const fetchNotificationCount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotificationCount(0);
      return;
    }

    try {
      const res = await axiosInstance.get("/notification/my-notifications");

      if (res.data.success) {
        const notifications = Array.isArray(res.data.data) ? res.data.data : [];

        const unread = notifications.filter(
          (notification) => !notification.isRead,
        ).length;

        setNotificationCount(unread);
      }
    } catch (err) {
      console.log("Notification Count Error:", err);
      setNotificationCount(0);
    }
  };
  const fetchFavoriteCount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setFavoritesCount(0);
      return;
    }

    try {
      const res = await axiosInstance.get("/favorite/my-favorites");

      if (res.data.success) {
        setFavoritesCount(res.data.data.length);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const clearSearch = () => {
    setSearch("");

    setSearchResults({
      meals: [],
      kitchens: [],
    });
  };
  useEffect(() => {
    fetchFavoriteCount();
  }, [user]);

  useEffect(() => {
    fetchNotificationCount();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (zoneRef.current && !zoneRef.current.contains(e.target)) {
        setIsZoneOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults({
        meals: [],
        kitchens: [],
      });

      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.get("/home/search", {
          params: {
            query: search.trim(),
            zone,
          },
        });

        setSearchResults(
          res.data?.data || {
            meals: [],
            kitchens: [],
          },
        );
      } catch (error) {
        console.log("Search Error:", error);

        setSearchResults({
          meals: [],
          kitchens: [],
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, zone]);

  useEffect(() => {
    fetchFavoriteCount();
  }, [user]);

  useEffect(() => {
    const refreshFavorites = () => {
      fetchFavoriteCount();
    };

    window.addEventListener("favoriteUpdated", refreshFavorites);

    return () => {
      window.removeEventListener("favoriteUpdated", refreshFavorites);
    };
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2v8a2 2 0 0 0 2 2v10M6 2v8m0-8v8m3-8v8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 2c-2 1.5-2 4-2 6s1 3 2 3v11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="logo-text">
          <h1>
            The Lucknow <span className="highlight">Meal Cart</span>
          </h1>
          <p>GHAR KA KHANA • LUCKNOW</p>
        </div>
      </div>

      <div className="zone-selector" ref={zoneRef}>
        <svg
          className="pin-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          <circle
            cx="12"
            cy="9"
            r="2.3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>

        <span className="zone-label">Deliver in:</span>

        <div
          className="zone-select-wrap"
          onClick={() => setIsZoneOpen((prev) => !prev)}
        >
          <span className="zone-current">{zone}</span>

          <svg
            className={`zone-arrow ${isZoneOpen ? "open" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {isZoneOpen && (
            <div className="zone-dropdown">
              <div className="zone-dropdown-title">Select Lucknow Zone</div>

              <ul>
                {ZONES.map((z) => (
                  <li
                    key={z}
                    className={z === zone ? "selected" : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      setZone(z);
                      setIsZoneOpen(false);
                    }}
                  >
                    <span>{z}</span>

                    {z === zone && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="search-bar">
        <div
          className="search-icon-btn"
          onClick={() => {
            if (search.trim()) {
              navigate(
                `/search?query=${encodeURIComponent(
                  search.trim(),
                )}&zone=${encodeURIComponent(zone)}`,
              );
            }
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2.2" />

            <path
              d="M21 21l-4.3-4.3"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search Text.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search.trim()) {
              navigate(
                `/search?query=${encodeURIComponent(
                  search.trim(),
                )}&zone=${encodeURIComponent(zone)}`,
              );
            }
          }}
        />

        {search.trim() !== "" && (
          <div className="search-dropdown">
            {searchResults.meals.length > 0 && (
              <>
                <div className="search-section-title">Meals</div>

                {searchResults.meals.map((meal) => (
                  <div
                    key={`meal-${meal._id}`}
                    className="search-item"
                    onClick={() => {
                      navigate(`/meal/${meal._id}`);
                      clearSearch();
                    }}
                  >
                    <h4>{meal.title}</h4>

                    <p>{meal.kitchenId?.kitchenName || "Kitchen"}</p>
                  </div>
                ))}
              </>
            )}

            {searchResults.kitchens.length > 0 && (
              <>
                <div className="search-section-title">Kitchens</div>

                {searchResults.kitchens.map((kitchen) => (
                  <div
                    key={`kitchen-${kitchen._id}`}
                    className="search-item"
                    onClick={() => {
                      navigate(`/kitchen/${kitchen._id}`);
                      clearSearch();
                    }}
                  >
                    <h4>{kitchen.kitchenName}</h4>

                    <p>
                      {kitchen.deliveryAreas?.length > 0
                        ? kitchen.deliveryAreas.join(", ")
                        : "Lucknow"}
                    </p>
                  </div>
                ))}
              </>
            )}

            {searchResults.meals.length === 0 &&
              searchResults.kitchens.length === 0 && (
                <div className="search-empty">No meals or kitchens found</div>
              )}
          </div>
        )}
      </div>

      <ul className="nav-links">
        <li onClick={() => navigate("/")}>Home</li>
        <li onClick={() => navigate("/about")}>About</li>
        <li onClick={() => navigate("/contact")}>Contact</li>
      </ul>

      <div className="navbar-right">
        <div className="icon-btn" onClick={() => navigate("/notifications")}>
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="#2a2a2a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="#2a2a2a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {notificationCount > 0 && (
            <span className="badge">{notificationCount}</span>
          )}
        </div>

        <div className="icon-btn" onClick={() => navigate("/favorites")}>
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.2 5 5.6 5c2 0 3.4 1 4.4 2.4C11 6 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.9C19.5 16.4 12 21 12 21z"
              stroke="#2a2a2a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {favoritesCount > 0 && (
            <span className="badge">{favoritesCount}</span>
          )}
        </div>

        <button className="cart-btn" onClick={() => navigate("/cart")}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.2a2 2 0 0 0 2-1.6L20 8H6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle cx="9" cy="21" r="1.4" fill="white" />

            <circle cx="17" cy="21" r="1.4" fill="white" />
          </svg>
          Cart
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>

        {user ? (
          <div className="profile-wrapper" ref={profileRef}>
            <div
              className="user-profile"
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <div className="user-profile-icon">
                <FiUser />
              </div>

              <span className="user-name">{user.name}</span>

              <svg
                className={`dropdown-arrow ${profileOpen ? "rotate" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#f5793a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-header-icon">
                    <FiUser />
                  </div>

                  <div>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="profile-divider" />

                {user.role === "customer" && (
                  <>
                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                    >
                      <FiUser />
                      <span>My Profile</span>
                    </div>

                    <div
                      className="Dashboard-profile-item"
                      onClick={() => {
                        navigate("/dashboard");
                        setProfileOpen(false);
                      }}
                    >
                      <FiUser />
                      <span>Dashboard</span>
                    </div>

                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/orders");
                        setProfileOpen(false);
                      }}
                    >
                      <FiPackage />
                      <span>My Orders</span>
                    </div>

                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/subscriptions");
                        setProfileOpen(false);
                      }}
                    >
                      <FiCreditCard />
                      <span>Buy Subscription</span>
                    </div>
                  </>
                )}

                {user.role === "provider" && (
                  <>
                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/provider/kitchen");
                        setProfileOpen(false);
                      }}
                    >
                      <FiUser />
                      <span>Manage Kitchen</span>
                    </div>
                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/provider/dashboard");
                        setProfileOpen(false);
                      }}
                    >
                      <FiUser />
                      <span>Dashboard</span>
                    </div>
                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/provider/profile");
                        setProfileOpen(false);
                      }}
                    >
                      <FiUser />
                      <span>My Profile</span>
                    </div>

                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/provider/orders");
                        setProfileOpen(false);
                      }}
                    >
                      <FiPackage />
                      <span>Provider Orders</span>
                    </div>

                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/provider/plans");
                        setProfileOpen(false);
                      }}
                    >
                      <FiCreditCard />
                      <span>My Plans</span>
                    </div>
                  </>
                )}

                {user.role === "admin" && (
                  <>
                    <div
                      className="profile-item"
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setProfileOpen(false);
                      }}
                    >
                      <FiUser />
                      <span>Dashboard</span>
                    </div>
                  </>
                )}

                <div className="profile-divider" />

                <div className="profile-item logout" onClick={handleLogout}>
                  <FiLogOut />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="auth-btn" onClick={() => navigate("/login")}>
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}
