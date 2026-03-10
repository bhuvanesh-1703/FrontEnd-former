import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaTruck,
  FaLeaf,
  FaRecycle,
  FaChevronDown,
  FaHeadset,
} from "react-icons/fa";
import "../css/FAQ.css";

const faqs = {
  shipping: {
    icon: <FaTruck />,
    label: "Shipping & Orders",
    color: "#2e7d32",
    items: [
      {
        q: "How does direct ordering work?",
        a: "When you place an order, it goes directly to the farmer who grew your produce. There's no middleman — no warehouse, no distribution centre. The farmer packs your order fresh and dispatches it straight to your doorstep.",
      },
      {
        q: "How long does delivery take?",
        a: "Most orders are delivered within 24–48 hours of harvest. Since we ship directly from the farm, your produce arrives fresher than anything you'd find on a store shelf.",
      },
      {
        q: "What are the shipping charges?",
        a: "Orders above ₹499 get FREE delivery. For orders below ₹499, a flat shipping fee of ₹49 is applied. All prices are inclusive of taxes.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your farmer dispatches the order, you'll receive a tracking link via SMS and email so you can follow your package every step of the way.",
      },
      {
        q: "What if my order arrives damaged or spoiled?",
        a: "We guarantee freshness. If anything arrives in bad condition, click 'Report Issue' in your order history within 24 hours of delivery and we'll arrange a replacement or full refund — no questions asked.",
      },
    ],
  },
  farming: {
    icon: <FaLeaf />,
    label: "Our Farming",
    color: "#43a047",
    items: [
      {
        q: "Who are the farmers on Farm Aura?",
        a: "Every farmer is personally vetted. We partner with small, independent family farms across India who follow organic and natural farming practices. No corporate farms — only real people growing real food.",
      },
      {
        q: "Are products really pesticide-free?",
        a: "Absolutely. All partner farmers commit to zero synthetic pesticide use. Many use traditional bio-pesticides such as neem oil, cow urine extracts, and companion planting techniques used for generations.",
      },
      {
        q: "How do farmers set their prices?",
        a: "Farmers set their own prices. Because we remove middlemen, farmers earn 2–3× more per kg than selling to a mandi. Better livelihoods for them, fair prices for you.",
      },
      {
        q: "Are the farm certifications verified?",
        a: "Yes. We verify organic certifications from NPOP, PGS-India, and state agricultural bodies. Certificates are available on each farmer's profile page.",
      },
      {
        q: "Can I visit the farm that grows my food?",
        a: "We run a Farm Visits programme where you can sign up for guided tours of partner farms. Check the 'Farm Visits' section under your account.",
      },
    ],
  },
};

const FAQAccordion = ({ section }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="faq-section" style={{ "--cat-accent": section.color }}>
      <div className="faq-cat-header">
        <div className="faq-cat-icon">{section.icon}</div>
        <h2 className="faq-cat-title">{section.label}</h2>
        <div className="faq-cat-count">{section.items.length} questions</div>
      </div>

      <div className="faq-items">
        {section.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-chevron" aria-hidden="true">
                  <FaChevronDown />
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="faq-answer-wrap"
                style={{
                  maxHeight: isOpen ? "400px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <p className="faq-answer-text">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("shipping");

  return (
    <div className="faq-page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="faq-hero">
        <div className="faq-hero-overlay" aria-hidden="true" />
        <Container>
          <div className="faq-hero-content">
          
            <h1 className="faq-hero-title">
              Questions?{" "}
              <span className="faq-hero-accent">We've got answers.</span>
            </h1>
          
          </div>
        </Container>
      </section>

      {/* ── Tab Navigation ───────────────────────────────────── */}
      <section className="faq-tabs-section">
        <Container>
          <div className="faq-tabs" role="tablist">
            {Object.entries(faqs).map(([key, section]) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                className={`faq-tab ${activeTab === key ? "faq-tab--active" : ""}`}
                onClick={() => setActiveTab(key)}
                style={{ "--tab-accent": section.color }}
              >
                <span className="faq-tab-icon">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAQ Content ──────────────────────────────────────── */}
      <section className="faq-content-section">
        <Container>
          <div className="faq-content-wrap">
            <FAQAccordion section={faqs[activeTab]} key={activeTab} />
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="faq-cta-section">
        <Container>
          <div className="faq-cta-card">
            <div className="faq-cta-icon-wrap">
              <FaHeadset className="faq-cta-icon" />
            </div>
            <h3 className="faq-cta-title">Still have questions?</h3>
            <p className="faq-cta-sub">
              Our team replies within 2 hours on weekdays. We're always happy to
              help.
            </p>
            <NavLink to="/contact" className="faq-cta-btn">
              Contact Our Team →
            </NavLink>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FAQ;
