import React from "react";
import "../css/ProductShowcase.css";

import { useNavigate } from "react-router-dom";

const ProductShowcase = () => {
  const navigate = useNavigate();
  return (
    <div className="showcase-container">
      <div className="showcase-content">
        {/* Left Section - Image */}
        <div className="showcase-image">
          <img
            src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=600&fit=crop"
            alt="Premium Organic Farming"
            className="showcase-product-image"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=600&h=600&fit=crop";
            }}
          />
        </div>

        {/* Right Section - Content */}
        <div className="showcase-details">
          <div className="showcase-label">PREMIUM FARMING</div>

          <h1 className="showcase-title">Harvest Organic Excellence</h1>

          <p className="showcase-description">
            Each product in our collection is cultivated with care and
            dedication. Experience the authenticity of farm-fresh produce that
            nourishes your family and supports sustainable farming practices.
          </p>

          {/* Features Grid */}
          <div className="showcase-features">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div className="feature-title">100% ORGANIC</div>
            </div>
            <div className="feature-item">
              <div className="feature-number">02</div>
              <div className="feature-title">FARM FRESH</div>
            </div>
            <div className="feature-item">
              <div className="feature-number">03</div>
              <div className="feature-title">SUSTAINABLE</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="showcase-btn"
            onClick={() => navigate("/products")}
          >
            Explore Produce
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
