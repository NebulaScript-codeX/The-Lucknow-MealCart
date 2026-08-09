import React, { useEffect, useRef, useState } from "react";
import "./WhyChooseUs.css";

const FEATURES = [
  {
    id: "01",
    title: "Verified Home Kitchens",
    desc: "Every kitchen is background-checked and FSSAI verified before it ever reaches your feed.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
    id: "02",
    title: "Fresh & Hygienic",
    desc: "Cooked the same day, packed with care, zero preservatives — just real ghar ka khana.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
    id: "03",
    title: "Lightning Fast Delivery",
    desc: "Hot meals at your door in 30-40 minutes flat, tracked live from kitchen to doorstep.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L3 14h7l-1 8 11-14h-7l1-6z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Pocket-Friendly Pricing",
    desc: "No hidden markups. Home-chef prices, straight from the kitchen to your plate.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "05",
    title: "Wide Variety",
    desc: "From Awadhi thalis to South Indian tiffins — 100+ dishes across every Lucknow zone.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    id: "06",
    title: "Made With Love",
    desc: "Every tiffin comes from a real home chef who cooks it like they would for their own family.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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

function FeatureCard({ feature, index, inView }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glowX: 50, glowY: 50 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    const rotateY = (px - 0.5) * 14; // left-right tilt
    const rotateX = (0.5 - py) * 14; // up-down tilt

    setTilt({
      rx: rotateX,
      ry: rotateY,
      glowX: px * 100,
      glowY: py * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  };

  return (
    <div
      className={`why-card ${inView ? "why-card-in" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="why-card-tilt"
        style={{
          transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          "--glow-x": `${tilt.glowX}%`,
          "--glow-y": `${tilt.glowY}%`,
        }}
      >
        <span className="why-card-number">{feature.id}</span>

        <div className="why-card-icon">{feature.icon}</div>

        <h3 className="why-card-title">{feature.title}</h3>
        <p className="why-card-desc">{feature.desc}</p>

        <div className="why-card-glow" />
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`why-choose-us ${isInView ? "in-view" : ""}`}
      ref={sectionRef}
    >
      <div className="why-blob why-blob-1" />
      <div className="why-blob why-blob-2" />

      <div className="why-choose-inner">
        <div className="why-header">
          <span className="why-tag">✦ Why Us</span>
          <h2 className="why-title">
            Why Lucknow Trusts
            <br />
            <span>The Meal Cart</span>
          </h2>
          <p className="why-sub">
            Not just food delivery — a promise of home, hygiene and honest
            pricing, every single tiffin.
          </p>
        </div>

        <div className="why-grid">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              feature={feature}
              index={i}
              inView={isInView}
              key={feature.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
