import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaClock,
  FaUtensils,
  FaUsers,
} from "react-icons/fa";

import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import axiosInstance from "../../utils/axiosInstance";
import "./Contact.css";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axiosInstance.post("/contact/create", formData);

      if (res.data.success) {
        toast.success("Message sent successfully 🍊");

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="contact-hero">
        <div className="contact-marquee">
          <div className="contact-track">
            {Array(6)
              .fill("HOMEMADE • FRESH • TRUSTED • LUCKNOW'S TASTE")
              .map((item, index) => (
                <span key={index}>{item}</span>
              ))}
          </div>
        </div>

        <div className="contact-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="contact-tag">
              <FaUtensils />
              Our Food Community
            </div>

            <h1>
              Let's Connect With
              <span>Lucknow's Kitchens</span>
            </h1>

            <p>
              Have questions, want to become a kitchen partner, or need help
              with your orders? Our team is always ready to assist you.
            </p>

            <div className="contact-pills">
              <span>🍲 Homemade Meals</span>

              <span>🏠 Verified Kitchens</span>

              <span>❤️ Authentic Taste</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-grid">
          {/* INFO */}

          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Talk To Us</span>

            <h2>We are here to help</h2>

            <p>
              Whether you are ordering food or joining our home chef community,
              we would love to hear from you.
            </p>

            <div className="contact-item">
              <div className="contact-icon">
                <FaPhoneAlt />
              </div>

              <div>
                <h4>Phone Support</h4>

                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaEnvelope />
              </div>

              <div>
                <h4>Email Support</h4>

                <p>support@lucknowmealcart.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <h4>Location</h4>

                <p>Lucknow, Uttar Pradesh</p>
              </div>
            </div>

            <div className="stats-box">
              <div>
                <FaUsers />

                <h3>45+</h3>

                <p>Home Kitchens</p>
              </div>

              <div>
                <FaClock />

                <h3>24h</h3>

                <p>Response Time</p>
              </div>
            </div>
          </motion.div>

          {/* FORM */}

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="form-heading">
              <span>Send Message</span>

              <h2>Let's Start A Conversation</h2>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              rows="5"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button disabled={loading}>
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Send Message
                  <FaPaperPlane />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </section>

      <section className="contact-cta">
        <h2>
          Bring the taste of
          <span> home </span>
          to everyone
        </h2>

        <p>Join The Lucknow Meal Cart community today.</p>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
