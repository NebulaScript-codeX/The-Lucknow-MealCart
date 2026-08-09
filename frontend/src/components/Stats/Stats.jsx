import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Stats.css";

function Counter({ end, duration = 1800, suffix = "", start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);

      const value = Math.floor(progress * end);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

const ICONS = {
  meals: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2v8a2 2 0 0 0 2 2v10M6 2v8m0-8v8m3-8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 2c-2 1.5-2 4-2 6s1 3 2 3v11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  kitchens: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),

  satisfaction: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-4.4-9.3-8.6C1.2 9 2.6 5.8 5.7 5.8c1.8 0 3.1 1 4.3 2.4 1.2-1.4 2.5-2.4 4.3-2.4 3.1 0 4.5 3.2 3 6.6C18.9 16.6 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  ),

  customers: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M2.5 20c0-3.5 3-6.5 6.5-6.5S15.5 16.5 15.5 20"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M16.5 8a3 3 0 100-.1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
};

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axiosInstance.get("/home/stats");

        console.log("Stats API", res.data);

        setStats(res.data.stats);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Meals Delivered",
      value: stats?.totalMealsDelivered || 0,
      suffix: "+",
      color: "orange",
      icon: ICONS.meals,
    },

    {
      title: "Trusted Kitchens",
      value: stats?.totalKitchens || 0,
      suffix: "+",
      color: "yellow",
      icon: ICONS.kitchens,
    },

    {
      title: "Customer Satisfaction",
      value: stats?.customerSatisfaction || 0,
      suffix: "%",
      color: "green",
      icon: ICONS.satisfaction,
    },

    {
      title: "Happy Customers",
      value: stats?.totalCustomers || 0,
      suffix: "+",
      color: "blue",
      icon: ICONS.customers,
    },
  ];

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-container">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div className="stats-card skeleton" key={i}>
                <div className="skeleton-circle"></div>
                <div className="skeleton-line big"></div>
                <div className="skeleton-line small"></div>
              </div>
            ))
          : cards.map((card) => (
              <div className={`stats-card ${card.color}`} key={card.title}>
                <div className={`stats-icon ${card.color}`}>{card.icon}</div>

                <h2 className={card.color}>
                  <Counter
                    end={card.value}
                    suffix={card.suffix}
                    start={visible}
                  />
                </h2>

                <p>{card.title}</p>
              </div>
            ))}
      </div>
    </section>
  );
}
