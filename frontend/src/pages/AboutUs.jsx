import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineTruck,
  HiOutlineLightBulb,
  HiOutlineGlobe,
} from "react-icons/hi";
import { FaLeaf, FaSeedling, FaHandshake, FaAward } from "react-icons/fa";
import "../css/About.css";

const values = [
  {
    icon: <HiOutlineShieldCheck />,
    title: "100% Organic",
    desc: "Every product is certified organic, grown without synthetic pesticides or harmful chemicals.",
    accent: "#2e7d32",
  },
  {
    icon: <HiOutlineUserGroup />,
    title: "Fair Trade",
    desc: "We ensure local farmers earn a fair price for their incredible hard work and dedication.",
    accent: "#388e3c",
  },
  {
    icon: <HiOutlineSparkles />,
    title: "Farm Fresh",
    desc: "We minimise time from harvest to table, ensuring maximum nutrients and natural flavour.",
    accent: "#43a047",
  },
  {
    icon: <HiOutlineTruck />,
    title: "Eco-Delivery",
    desc: "Our delivery network uses eco-friendly packaging and optimised routes to cut our carbon footprint.",
    accent: "#66bb6a",
  },
];

const stats = [
  { number: "50+", label: "Local Farmers", icon: <FaHandshake /> },
  { number: "100%", label: "Organic Certified", icon: <FaLeaf /> },
  { number: "48h", label: "Farm-to-Door", icon: <FaSeedling /> },
];

const milestones = [
  {
    year: "2014",
    event: "Founded as a small community initiative in Pune, MH.",
  },
  {
    year: "2017",
    event: "Reached 20+ partner farmers across Maharashtra & Tamil Nadu.",
  },
  {
    year: "2020",
    event: "Launched zero-plastic, compostable packaging across all orders.",
  },
  {
    year: "2023",
    event: "Crossed 10,000 happy households. Farm visits program launched.",
  },
  {
    year: "2026",
    event: "Expanding to 5 new states with 50+ certified organic farms.",
  },
];

const AboutUs = () => {
  return (
    <div className="about-page-wrapper">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-overlay" aria-hidden="true" />
        <Container>
          <div className="about-hero-content">
           
            <h1 className="about-hero-title">
              Rooted in Nature,
              <br />
              <span className="about-hero-accent">Grown with Purpose</span>
            </h1>
           
            
          </div>
        </Container>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────── */}
      <section className="about-stats-strip">
        <Container>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon">{s.icon}</div>
                <h3 className="stat-number">{s.number}</h3>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Our Story ────────────────────────────────────────── */}
      <section className="about-story-section">
        <Container>
          <Row className="justify-content-center g-5">
            <Col lg={8} className="text-center">
              <div className="story-text-wrap text-center p-0">
                <span className="section-eyebrow">Our Story</span>
                <h2 className="section-heading">
                  Bridging the Gap Between{" "}
                  <span className="text-green">Nature &amp; You</span>
                </h2>
                <div className="section-body-wrap max-width-md mx-auto">
                  <p className="section-body">
                    Farm Aura started as a community initiative where a group of
                    passionate food lovers refused to accept that "organic" had
                    to mean expensive and inaccessible. We drove out to local
                    farms, built real relationships, and created a direct supply
                    chain from soil to soul.
                  </p>
                  <p className="section-body">
                    Today we support over 50 independent family farms,
                    delivering harvests that arrive at your door within 48 hours
                    — fresher than anything you'll find on a store shelf. Every
                    purchase directly funds a farmer's livelihood.
                  </p>
                </div>
                <div className="story-tags justify-content-center">
                  <span className="story-tag">🌿 Zero Pesticides</span>
                  <span className="story-tag">📦 Compostable Packaging</span>
                  <span className="story-tag">🤝 Fair Trade</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Our Values ───────────────────────────────────────── */}
      <section className="about-values-section">
        <Container>
          <div className="section-header-center">
            <span className="section-eyebrow">Our Principles</span>
            <h2 className="section-heading">
              Why Choose <span className="text-green">Farm Aura?</span>
            </h2>
            <p className="section-subhead">
              Four pillars that guide everything we do — from the seeds our
              farmers plant to the box that lands on your doorstep.
            </p>
          </div>
          <Row className="g-4 mt-2">
            {values.map((v, i) => (
              <Col key={i} md={6} lg={3}>
                <div className="value-card" style={{ "--accent": v.accent }}>
                  <div className="value-icon-wrap">
                    <span className="value-icon">{v.icon}</span>
                  </div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                  <div className="value-accent-line" />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
