import React from "react";
import "./Footer.css";
import BackToTop from "../BackToTop/BackToTop";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        {/* Background Glow */}
        <div className="footer-glow glow-one"></div>
        <div className="footer-glow glow-two"></div>

        <div className="footer-container">
          {/* ================= CTA ================= */}
          <div className="footer-cta">
            <div className="cta-left">
              <span className="cta-tag">🍲 Fresh Home Cooked Meals</span>
              <h2>
                Ready to taste <span>homemade happiness?</span>
              </h2>
              <p>
                Discover delicious homemade meals prepared by trusted kitchens
                across Lucknow, delivered fresh to your doorstep.
              </p>
            </div>

            <button className="cta-btn">
              <a href="/meal/all" className="cta-btn">
                Order Now
              </a>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="footer-divider"></div>

          {/* ================= MAIN FOOTER ================= */}
          <div className="footer-grid">
            {/* BRAND — same logo icon as Navbar */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-circle">
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

                <div>
                  <h3>
                    The Lucknow<span> Meal Cart</span>
                  </h3>
                  <small>Home Made • Fresh • Hygienic</small>
                </div>
              </div>

              <p className="brand-desc">
                Bringing authentic homemade food from trusted kitchens across
                Lucknow directly to your doorstep with freshness, love and care.
              </p>

              <div className="footer-social">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* LINKS */}
            <div className="footer-column">
              <h4>Quick Links</h4>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/favorites">Favorites</a>
            </div>

            {/* SERVICES */}
            <div className="footer-column">
              <h4>Services</h4>
              <a href="/meal/all">Browse Meals</a>
              <a href="/login">Become Provider</a>
              <a href="/subscriptions">Subscriptions</a>
              <a href="/orders">Track Orders</a>
            </div>

            {/* CONTACT */}
            <div className="footer-column">
              <h4>Contact</h4>
              <div className="contact-item">
                <HiOutlineLocationMarker />
                <span>Lucknow, Uttar Pradesh</span>
              </div>
              <div className="contact-item">
                <HiOutlinePhone />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <HiOutlineMail />
                <span>support@mealcart.com</span>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM ================= */}
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} <span>The Lucknow Meal Cart</span>.
              All Rights Reserved.
            </p>

            <div className="footer-bottom-links">
              <a href="/">Privacy</a>
              <a href="/">Terms</a>
              <a href="/">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </>
  );
}
