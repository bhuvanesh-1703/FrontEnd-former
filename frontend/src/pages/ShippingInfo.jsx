import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../css/ShippingInfo.css";

const steps = [
  {
    icon: "🛒",
    title: "You Place an Order",
    desc: "Browse our catalog and choose fresh organic produce. Your order is confirmed instantly.",
  },
  {
    icon: "📲",
    title: "Farmer is Notified",
    desc: "The farmer who grows your chosen produce receives your order directly — no warehouse, no middleman.",
  },
  {
    icon: "📦",
    title: "Freshly Packed",
    desc: "Within hours of harvest, the farmer packs your produce in eco-friendly, compostable packaging.",
  },
  {
    icon: "🚚",
    title: "Dispatched Direct to You",
    desc: "Your package leaves the farm and travels straight to your address. No cold-storage detours.",
  },
  {
    icon: "🏡",
    title: "Delivered Fresh",
    desc: "Your order arrives at your door within 24–48 hours of harvest — farm-fresh guaranteed.",
  },
];

const shippingRates = [
  {
    label: "Standard Delivery",
    time: "24-48 hours",
    charge: "₹49",
    note: "For orders under ₹499",
    highlight: false,
  },
  {
    label: "Free Delivery",
    time: "24-48 hours",
    charge: "FREE",
    note: "For orders ₹499 & above",
    highlight: true,
  },
  {
    label: "Express Delivery",
    time: "Same Day",
    charge: "₹99",
    note: "Available in select cities",
    highlight: false,
  },
];

const policies = [
  {
    icon: "🔄",
    title: "Easy Returns",
    desc: "Not satisfied? Report within 24 hours of delivery. We'll arrange a replacement or full refund instantly.",
  },
  {
    icon: "🥬",
    title: "Freshness Guarantee",
    desc: "If your produce arrives wilted or spoiled for any reason, you won't pay a rupee for it.",
  },
  {
    icon: "📍",
    title: "Live Order Tracking",
    desc: "Get real-time updates via SMS and email from the moment your farmer packs your order.",
  },
  {
    icon: "🌿",
    title: "Eco Packaging",
    desc: "All packaging is 100% compostable — no plastic, no guilt. Toss it straight in your compost bin.",
  },
];

const ShippingInfo = () => {
  return (
    <div className="shipping-page">
    
      <div className="shipping-hero">
        <Container>
          <span className="shipping-badge">Shipping & Delivery</span>
          <h1 className="shipping-hero-title">
            Straight from the <span>Farm</span> to Your Door
          </h1>
          <p className="shipping-hero-sub">
            No warehouses. No middlemen. No cold-storage delays. Your order goes
            directly from the farmer who grew it to your doorstep.
          </p>
        </Container>
      </div>

      <div className="shipping-trust-bar">
        <Container>
          <div className="trust-bar-inner">
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>24-48hr Farm-to-Door</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <span className="trust-icon">🆓</span>
              <span>Free Shipping over ₹499</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <span className="trust-icon">💯</span>
              <span>Freshness Guaranteed</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <span className="trust-icon">📦</span>
              <span>Eco-Friendly Packaging</span>
            </div>
          </div>
        </Container>
      </div>

      <div className="shipping-content">
        <Container>
         
          <section className="shipping-section">
            <h2 className="section-heading">How Direct Delivery Works</h2>
            <p className="section-sub">
              Every order skips 3-4 supply chain steps. Here's exactly what
              happens after you click "Add to Cart".
            </p>
            <div className="steps-track">
              {steps.map((step, i) => (
                <div className="step-card" key={i}>
                  <div className="step-number">{i + 1}</div>
                  <div className="step-icon">{step.icon}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                  {i < steps.length - 1 && <div className="step-connector" />}
                </div>
              ))}
            </div>
          </section>

       
          <section className="shipping-section">
            <h2 className="section-heading">Shipping Rates</h2>
            <p className="section-sub">
              Simple, transparent pricing. No hidden fees.
            </p>
            <Row className="g-4 justify-content-center">
              {shippingRates.map((rate, i) => (
                <Col key={i} xs={12} sm={6} lg={4}>
                  <div
                    className={`rate-card ${rate.highlight ? "rate-card--featured" : ""}`}
                  >
                    {rate.highlight && (
                      <div className="rate-ribbon">Most Popular</div>
                    )}
                    <div className="rate-label">{rate.label}</div>
                    <div className="rate-charge">{rate.charge}</div>
                    <div className="rate-time">⏱ {rate.time}</div>
                    <div className="rate-note">{rate.note}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

         
          <section className="shipping-section">
            <h2 className="section-heading">Our Promises to You</h2>
            <p className="section-sub">
              We don't just ship products — we deliver trust.
            </p>
            <Row className="g-4">
              {policies.map((p, i) => (
                <Col key={i} xs={12} sm={6} lg={3}>
                  <div className="policy-card">
                    <div className="policy-icon">{p.icon}</div>
                    <h5>{p.title}</h5>
                    <p>{p.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

      
          <section className="shipping-section">
            <div className="pincode-cta">
              <h3>Questions about delivery to your area?</h3>
              <p>
                We currently deliver to 200+ cities across India and are
                expanding every month.
              </p>
              <div className="pincode-actions">
                <NavLink to="/contact" className="pincode-btn-primary">
                  Contact Support
                </NavLink>
                <NavLink to="/faq" className="pincode-btn-ghost">
                  Read FAQ →
                </NavLink>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </div>
  );
};

export default ShippingInfo;
