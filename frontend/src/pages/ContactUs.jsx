import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import axios from "axios";
import API_URL from "../config";
import Swal from "sweetalert2";
import "../css/Contact.css";

const contactItems = [
  {
    icon: <HiOutlineMail />,
    label: "Email Us",
    lines: ["hello@farmaura.in", "support@farmaura.in"],
    href: "mailto:hello@farmaura.in",
    accent: "#2e7d32",
  },
  {
    icon: <HiOutlinePhone />,
    label: "Call Us",
    lines: ["+91 98765 43210"],
    href: "tel:+919876543210",
    accent: "#388e3c",
  },
  {
    icon: <HiOutlineLocationMarker />,
    label: "Visit Us",
    lines: ["123 Organic Way, Green Valley", "Rajapalayam, TN 626117"],
    href: "#",
    accent: "#43a047",
  },
  {
    icon: <HiOutlineClock />,
    label: "Working Hours",
    lines: ["Mon – Sat: 9 AM – 6 PM", "Sunday: Closed"],
    href: null,
    accent: "#66bb6a",
  },
];

const socials = [
  { icon: <FaFacebookF />, label: "Facebook", href: "#" },
  { icon: <FaTwitter />, label: "Twitter", href: "#" },
  { icon: <FaInstagram />, label: "Instagram", href: "#" },
  { icon: <FaLinkedinIn />, label: "LinkedIn", href: "#" },
];

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    userId: null,
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  //const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setForm((prev) => ({
          ...prev,
          name: parsedUser.username || parsedUser.name || "",
          email: parsedUser.email || "",
          userId: parsedUser.id || parsedUser._id || null,
        }));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/messages`, form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting us. We'll get back to you within 24 hours.",
        confirmButtonColor: "#2e7d32",
      });
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to send message. Please try again later.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* ── Hero Header ──────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-overlay" aria-hidden="true" />
        <Container>
          <div className="contact-hero-content">
            <h1 className="contact-hero-title">
              We're Here to{" "}
              <span className="contact-hero-accent">Help You</span>
            </h1>
          </div>
        </Container>
      </section>

      <section className="contact-main">
        <Container>
          <Row className="g-5 align-items-start justify-content-center">
            <Col lg={5} md={10}>
              <div className="contact-info-panel">
                <h2 className="info-panel-title">Connect with Farm Aura</h2>
                <p className="info-panel-sub">
                  Whether you're a curious shopper or a local farmer, we'd love
                  to hear from you.
                </p>

                <div className="contact-cards-list">
                  {contactItems.map((item, i) => (
                    <div
                      className="contact-info-card"
                      key={i}
                      style={{ "--card-accent": item.accent }}
                    >
                      <div className="cic-icon-wrap">{item.icon}</div>
                      <div className="cic-text">
                        <h4 className="cic-label">{item.label}</h4>
                        {item.lines.map((line, j) =>
                          item.href && item.href !== "#" ? (
                            <a href={item.href} className="cic-line" key={j}>
                              {line}
                            </a>
                          ) : (
                            <p className="cic-line" key={j}>
                              {line}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div className="contact-social-block">
                  <h4 className="social-block-title">Follow Our Journey</h4>
                  <div className="contact-socials">
                    {socials.map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        className="contact-social-pill"
                        aria-label={s.label}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={7} md={10}>
              <div className="contact-form-card">
                <div className="form-card-header">
                  <h2 className="form-card-title">Send Us a Message</h2>
                  <p className="form-card-sub">
                    Fields marked with <span className="req-star">*</span> are
                    required.
                  </p>
                </div>

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <Row>
                    <Col md={6}>
                      <div className="form-field">
                        <label htmlFor="contact-name" className="form-label">
                          Full Name <span className="req-star">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          className="form-input"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-field">
                        <label htmlFor="contact-email" className="form-label">
                          Email Address <span className="req-star">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          className="form-input"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Col>
                  </Row>

                  <div className="form-field">
                    <label htmlFor="contact-phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength="10"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message" className="form-label">
                      Message <span className="req-star">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-input form-textarea"
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={`contact-submit-btn ${loading ? "contact-submit-btn--loading" : ""}`}
                    disabled={loading || sent}
                  >
                    {loading ? (
                      <span className="btn-spinner" aria-hidden="true" />
                    ) : sent ? (
                      "Message Sent ✓"
                    ) : (
                      "Send Message →"
                    )}
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ContactUs;
