import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaLeaf,
  FaRecycle,
  FaSeedling,
  FaGlobeAmericas,
  FaChevronDown,
  FaWater,
} from "react-icons/fa";
import "../css/Sustainability.css";

const Sustainability = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const pillars = [
    {
      icon: <FaRecycle />,
      title: "Zero Waste Packing",
      text: "Every box we ship is 100% plastic-free and compostable. We use recycled cardboard and plant-fiber liners.",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Direct Logistics",
      text: "By removing middlemen, we eliminate unnecessary transport legs, reducing our carbon footprint by up to 40%.",
    },
    {
      icon: <FaLeaf />,
      title: "Regenerative Farming",
      text: "Our farmers use techniques that restore soil health, capture carbon, and promote local biodiversity.",
    },
  ];

  const sustainabilityFAQs = [
    {
      q: "How does Farm Aura reduce packaging waste?",
      a: "We use 100% compostable or biodegradable packaging — no single-use plastics. Boxes are made from recycled corrugated cardboard and plant-fibre inner liners.",
    },
    {
      q: "What is your carbon footprint?",
      a: "By shipping direct from farm to consumer, we eliminate 2–3 intermediate transport legs. We also partner with logistics providers transitioning to EV fleets in major cities.",
    },
    {
      q: "Do you support water conservation?",
      a: "Yes. We actively support farmers adopting drip irrigation, rainwater harvesting, and soil moisture management. These farmers are highlighted with a Water Saver badge.",
    },
    {
      q: "How do you handle food waste?",
      a: "Produce that doesn't meet visual grading (but is perfectly edible) is sold in our 'Imperfect Harvest' collection at a discount. We also donate surplus to local food banks via NGO partners.",
    },
    {
      q: "Is Farm Aura committed to biodiversity?",
      a: "Deeply. We encourage farmers to grow heirloom and indigenous varieties. Products labelled 'Heritage Variety' support seed biodiversity and local ecosystems.",
    },
  ];

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="sus-page">
     
      <section className="sus-hero">
        <div className="sus-hero-overlay" />
        <Container>
          <div className="sus-hero-content text-center">
           
            <h1 className="sus-title">
              Better for the <span className="sus-gradient-text">Planet</span>,
              Better for <span className="sus-gradient-text">You</span>
            </h1>
           
          </div>
        </Container>
      </section>

     
      <section className="sus-pillars-section">
        <Container>
          <Row className="g-5">
            {pillars.map((pillar, idx) => (
              <Col lg={4} key={idx}>
                <div className="pillar-card">
                  <div className="pillar-icon">{pillar.icon}</div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-text">{pillar.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

     
      <section className="sus-faq-section">
        <Container>
          <div className="sus-faq-header text-center mb-5">
            <h2 className="sus-faq-title">
              Sustainability <span className="sus-faq-accent">FAQ</span>
            </h2>
            <p className="sus-faq-sub">
              Transparency is part of our mission. Here's how we handle the
              details.
            </p>
          </div>

          <div className="sus-faq-wrap">
            {sustainabilityFAQs.map((item, i) => (
              <div
                key={i}
                className={`sus-faq-item ${openIndex === i ? "open" : ""}`}
              >
                <button className="sus-faq-question" onClick={() => toggle(i)}>
                  <span>{item.q}</span>
                  <FaChevronDown className="sus-faq-chevron" />
                </button>
                <div
                  className="sus-faq-answer"
                  style={{ maxHeight: openIndex === i ? "300px" : "0" }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

    
      <section className="sus-impact-cta">
        <Container>
          <div className="impact-card">
            <FaSeedling className="impact-icon" />
            <h2 className="impact-title">
              Together, we've saved over 50,000 plastic bags this year.
            </h2>
            <p className="impact-sub">
              Every order you place supports a local farmer and a healthier
              planet.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Sustainability;
