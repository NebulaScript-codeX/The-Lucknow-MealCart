import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./About.css";

// Generic scroll-reveal hook — fades + slides an element in once it
// enters the viewport (used by every section below).
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

const VALUES = [
  {
    title: "Trust First",
    desc: "Every kitchen is verified, every chef background-checked, before a single tiffin ships.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2l8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Real Homemade Quality",
    desc: "No cloud kitchens, no assembly lines — just real ghar ka khana cooked fresh, daily.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21s-7-4.4-9.3-8.6C1.2 9 2.6 5.8 5.7 5.8c1.8 0 3.1 1 4.3 2.4 1.2-1.4 2.5-2.4 4.3-2.4 3.1 0 4.5 3.2 3 6.6C18.9 16.6 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Community Powered",
    desc: "Every order supports a real home chef in Lucknow, building a livelihood from their kitchen.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle
          cx="17"
          cy="9"
          r="2.6"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M21.5 20c0-2.7-1.8-5-4.3-5.9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Made With Passion",
    desc: "Behind every dish is a chef who cooks it the way they'd cook it for their own family.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
    h: 340,
    caption: "Paneer Butter Masala",
  },
  {
    src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80",
    h: 260,
    caption: "Veg Thali",
  },
  {
    src: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80",
    h: 300,
    caption: "Aloo sabzi",
  },
  {
    src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
    h: 380,
    caption: "Veg Biryani",
  },
  {
    src: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80",
    h: 260,
    caption: "Murg Pulawo",
  },
  {
    src: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80",
    h: 320,
    caption: "Pav Bhaji",
  },
];

function ValueCard({ value, index, inView }) {
  return (
    <div
      className={`value-card ${inView ? "value-card-in" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="value-icon">{value.icon}</div>
      <h3>{value.title}</h3>
      <p>{value.desc}</p>
    </div>
  );
}

function GalleryTile({ item, index, inView }) {
  return (
    <div
      className={`gallery-tile ${inView ? "gallery-tile-in" : ""}`}
      style={{ height: item.h, transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <img src={item.src} alt={item.caption} />
      <div className="gallery-overlay">
        <span>{item.caption}</span>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const [storyRef, storyIn] = useReveal();
  const [valuesRef, valuesIn] = useReveal();
  const [galleryRef, galleryIn] = useReveal(0.05);
  const [ctaRef, ctaIn] = useReveal();

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="about-hero">
        <div className="about-hero-marquee">
          <div className="marquee-track">
            {Array(6)
              .fill("HOMEMADE • FRESH • HYGIENIC • MADE WITH LOVE")
              .map((t, i) => (
                <span key={i}>{t}&nbsp;&nbsp;&nbsp;</span>
              ))}
          </div>
        </div>

        <div className="about-hero-inner">
          <span className="about-hero-tag">✦ Our Story</span>
          <h1 className="about-hero-title">
            Bringing Lucknow's
            <br />
            <span>Kitchens Home</span> To You
          </h1>
          <p className="about-hero-sub">
            The Lucknow Meal Cart started with one simple idea — everyone
            deserves a home-cooked meal, even when home is busy. We connect
            trusted home chefs with people craving real, honest food.
          </p>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section
        className={`about-story ${storyIn ? "in-view" : ""}`}
        ref={storyRef}
      >
        <div className="about-story-media">
          <img
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80"
            alt="Homemade meal"
            className="story-img story-img-main"
          />
          <img
            src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80"
            alt="Kitchen"
            className="story-img story-img-float"
          />
          <div className="story-badge">
            <strong>45+</strong>
            <span>Home Kitchens</span>
          </div>
        </div>

        <div className="about-story-text">
          <span className="section-tag">🍲 How It Started</span>
          <h2>
            From One Kitchen<span> To A Movement</span>
          </h2>
          <p>
            It began with Anita, a home chef in Gomti Nagar, who cooked for
            three neighbours who missed their mothers' cooking. Word spread.
            Soon, dozens of kitchens across Lucknow wanted in.
          </p>
          <p>
            Today, The Lucknow Meal Cart connects trusted home chefs with
            thousands of people across the city — no cloud kitchens, no
            shortcuts, just real food made with real care.
          </p>

          <div className="story-points">
            <div>
              <span className="story-dot" />
              FSSAI verified kitchens only
            </div>
            <div>
              <span className="story-dot" />
              Zero preservatives, cooked same-day
            </div>
            <div>
              <span className="story-dot" />
              Direct support for local home chefs
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section
        className={`about-values ${valuesIn ? "in-view" : ""}`}
        ref={valuesRef}
      >
        <div className="about-values-header">
          <span className="section-tag section-tag-center">
            💛 What We Stand For
          </span>
          <h2>
            Our <span>Core Values</span>
          </h2>
        </div>

        <div className="value-grid">
          {VALUES.map((v, i) => (
            <ValueCard value={v} index={i} inView={valuesIn} key={v.title} />
          ))}
        </div>
      </section>

      {/* ================= PINTEREST-STYLE GALLERY ================= */}
      <section
        className={`about-gallery-section ${galleryIn ? "in-view" : ""}`}
        ref={galleryRef}
      >
        <div className="about-values-header">
          <span className="section-tag section-tag-center">
            📸 From Our Kitchens
          </span>
          <h2>
            A Taste Of What's <span>Cooking</span>
          </h2>
        </div>

        <div className="masonry-grid">
          {GALLERY.map((item, i) => (
            <GalleryTile
              item={item}
              index={i}
              inView={galleryIn}
              key={item.caption}
            />
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className={`about-cta ${ctaIn ? "in-view" : ""}`} ref={ctaRef}>
        <div className="about-cta-inner">
          <h2>
            Ready to taste <span>real homemade food?</span>
          </h2>
          <p>Explore kitchens near you, or bring your own recipes to life.</p>
          <div className="about-cta-actions">
            <button
              className="cta-btn-primary"
              onClick={() => navigate("/kitchen/all")}
            >
              Explore Kitchens
            </button>

            <button
              className="cta-btn-secondary"
              onClick={() => navigate("/login")}
            >
              Become a Provider
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
