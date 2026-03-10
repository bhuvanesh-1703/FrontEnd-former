import React, { useState } from "react";
import { Container } from "react-bootstrap";
import {
  FaSeedling,
  FaEnvelope,
  FaLeaf,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";
import "../css/Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <>
      <section className="footer-newsletter-strip mt-5">
        <Container>
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <h3 className="newsletter-heading">
                <FaSeedling className="nl-leaf" /> Farm-Fresh in Your Inbox
              </h3>
              <p className="newsletter-sub">
                Get seasonal harvests, exclusive offers & farm stories. No spam,
                ever.
              </p>
            </div>

            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="nl-input-wrap">
                <FaEnvelope className="nl-input-icon" />
                <input
                  type="email"
                  className="nl-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className={`nl-btn ${subscribed ? "nl-btn--success" : ""}`}
                  disabled={subscribed}
                >
                  {subscribed ? "✓ Subscribed!" : "Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </section>

      <section className="footer-trust-strip">
        <Container>
          <div className="trust-badges">
            <div className="trust-badge">
              <FaLeaf className="tb-icon" />
              <span>100% Organic Certified</span>
            </div>

            <div className="trust-divider" />

            <div className="trust-badge">
              <FaTruck className="tb-icon" />
              <span>Free Delivery Over ₹499</span>
            </div>

            <div className="trust-divider" />

            <div className="trust-badge">
              <FaShieldAlt className="tb-icon" />
              <span>Secure & Trusted Payments</span>
            </div>

            <div className="trust-divider" />

            <div className="trust-badge">
              <FaSeedling className="tb-icon" />
              <span>Pesticide-Free Guarantee</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Newsletter;
