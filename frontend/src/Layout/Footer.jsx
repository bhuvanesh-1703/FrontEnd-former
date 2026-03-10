import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaLeaf,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSeedling,
  FaTruck,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
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
      <footer className="footer-premium">
      
        {/* ── Main Footer Body ──────────────────────────────────── */}
        <section className="footer-main-tier">
          <div className="footer-grain-overlay" aria-hidden="true" />
          <Container>
            <Row className="gy-5">
              {/* ── Brand Column ─────────────────────────── */}
              <Col lg={4} md={12}>
                <div className="footer-brand-premium">
                  <div className="brand-logo-box">
                    <FaLeaf className="leaf-icon" />
                  </div>
                  <div className="brand-text">
                    <span className="brand-name">
                      <span className="terra">Farm</span>
                      <span className="fresh">Aura</span>
                    </span>
                    <p className="brand-tagline">Boutique Organic Artisans</p>
                  </div>
                </div>

                <p className="footer-manifesto">
                  Farm Aura movement — delivering
                  nature's finest harvests straight from our soil to your soul
                  within 48 hours. 100% Pesticide-free, 100% Transparent.
                </p>

                {/* Contact Info */}
                <ul className="footer-contact-list">
                  <li>
                    <FaPhone className="contact-icon" />
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </li>
                  <li>
                    <FaEnvelope className="contact-icon" />
                    <a href="mailto:hello@farmaura.in">farmaura@gmail.in</a>
                  </li>
                  <li>
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>Rajapalayam, tamil Nadu, 626117</span>
                  </li>
                </ul>

                {/* Social Icons */}
                <div className="premium-socials" role="list">
                  <a
                    href="#"
                    className="social-pill"
                    aria-label="Facebook"
                    role="listitem"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="#"
                    className="social-pill"
                    aria-label="Instagram"
                    role="listitem"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="#"
                    className="social-pill"
                    aria-label="Twitter"
                    role="listitem"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="#"
                    className="social-pill"
                    aria-label="LinkedIn"
                    role="listitem"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              </Col>

              {/* ── Artisanal Shop Links ──────────────────── */}
              <Col lg={2} md={4} xs={6}>
                <h5 className="column-title">Shop</h5>
                <ul className="premium-links">
                  <li>
                    <NavLink to="/products">New Arrivals</NavLink>
                  </li>
                  <li>
                    <NavLink to="/products">Organic Vegetables</NavLink>
                  </li>
                  <li>
                    <NavLink to="/products">Fresh Fruits</NavLink>
                  </li>
                  <li>
                    <NavLink to="/category">Browse Categories</NavLink>
                  </li>
                </ul>
              </Col>

              {/* ── Deep Roots Links ──────────────────────── */}
              <Col lg={2} md={4} xs={6}>
                <h5 className="column-title">Deep Roots</h5>
                <ul className="premium-links">
                  <li>
                    <NavLink to="/aboutus">Our Story</NavLink>
                  </li>
                  <li>
                    <NavLink to="/contact">Visit the Farm</NavLink>
                  </li>
                  <li>
                    <NavLink to="/contact">Contact Us</NavLink>
                  </li>
                  <li>
                    <NavLink to="/sustainability">Sustainability</NavLink>
                  </li>
                </ul>
              </Col>

              {/* ── Client Care Links ─────────────────────── */}
              <Col lg={2} md={4} xs={12}>
                <h5 className="column-title">Client Care</h5>
                <ul className="premium-links">
                  <li>
                    <NavLink to="/faq">FAQ</NavLink>
                  </li>
                  <li>
                    <NavLink to="/shippinginfo">Shipping Info</NavLink>
                  </li>
                  <li>
                    <NavLink to="/faq">Returns Policy</NavLink>
                  </li>
                  <li>
                    <NavLink to="/faq">Order Tracking</NavLink>
                  </li>
                  <li>
                    <NavLink to="/faq">Privacy &amp; Trust</NavLink>
                  </li>
                </ul>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ── Bottom Bar ────────────────────────────────────────── */}
        <section className="footer-bottom-luxe">
          <Container>
            <div className="bottom-flex">
              <p className="copy-text">
                © {new Date().getFullYear()} Farm Aura Artisanal. Handcrafted
                with soul.
              </p>
              <div className="legal-links">
                <NavLink to="/faq">Terms</NavLink>
                <span className="dot" aria-hidden="true">
                  •
                </span>
                <NavLink to="/faq">Privacy</NavLink>
                <span className="dot" aria-hidden="true">
                  •
                </span>
                <NavLink to="/faq">Ethics</NavLink>
              </div>
            </div>
          </Container>
        </section>
      </footer>
    </>
  );
};

export default Footer;
