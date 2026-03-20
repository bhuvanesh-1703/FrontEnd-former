import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../css/Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data.categories);
      // console.log(response.data.categories);
    } catch (error) {
      // console.log("Failed to fetch category", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <section
      className="category-section"
      aria-label="Browse product categories"
    >
      <Container>
        <div className="category-header text-center">
          <span className="category-section-badge">Browse Categories</span>
          <h2 className="category-section-title">
            Shop By <span className="highlight-green">Category</span>
          </h2>
        </div>
        <Row className="g-4 mt-2">
          {categories.map((cat) => (
            <Col key={cat.id} xs={12} sm={6} lg={4}>
              <NavLink
                to={`/viewcategory/${cat.id}`}
                className="category-card-link"
              >
                <article className="category-card">
                  <div className="category-image-container">
                    <img
                      src={`${API_URL}/uploads/${cat.image?.split(",")[0]}`}
                      alt={cat.category_name}
                      className="category-image"
                      loading="lazy"
                    />
                    <div className="category-overlay" />
                  </div>

                  <div className="category-info">
                    <h3 className="category-name">{cat.category_name}</h3>
                    <p className="category-description">{cat.description}</p>

                    <div className="category-meta">
                      <span className="product-count">View Products</span>
                      <span className="explore-arrow">→</span>
                    </div>
                  </div>
                </article>
              </NavLink>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Category;
