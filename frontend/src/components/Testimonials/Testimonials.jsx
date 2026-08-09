import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Testimonials.css";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const res = await axiosInstance.get("/review/home-testimonials");

      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const allReviews = [...reviews, ...reviews];

  return (
    <section className="testimonials-section">
      <div className="testimonial-glow glow-1"></div>
      <div className="testimonial-glow glow-2"></div>

      <div className="testimonial-heading">
        <span>Testimonials</span>

        <h2>
          What Our Customers
          <br />
          <span>Say About Us</span>
        </h2>

        <p>Real experiences from happy food lovers across Lucknow.</p>
      </div>

      {loading ? (
        <div className="testimonial-loading">Loading Reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="testimonial-loading">No Reviews Yet</div>
      ) : (
        <div className="testimonial-slider">
          <div className="testimonial-track">
            {allReviews.map((review, index) => (
              <div className="testimonial-card" key={`${review._id}-${index}`}>
                <div className="quote-mark">“</div>

                <div className="stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                <p className="review-text">{review.comment}</p>

                <div className="review-user">
                  <div className="avatar">
                    {review.customerId?.profileImage ? (
                      <img
                        src={`http://localhost:4000/${review.customerId.profileImage}`}
                        alt={review.customerId?.name}
                      />
                    ) : (
                      review.customerId?.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>

                  <div className="review-info">
                    <h4>{review.customerId?.name || "Customer"}</h4>

                    <span>
                      {review.kitchenId?.kitchenName || "Home Kitchen"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
