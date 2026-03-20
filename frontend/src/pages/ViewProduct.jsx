import axios from "axios";
import API_URL from "../config";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { HiOutlineShoppingCart, HiCheckCircle } from "react-icons/hi";
import "../css/ViewProduct.css";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/product/${id}`,
      );
      setProduct(response.data.product);
      // console.log(response.data.product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="view-product-wrapper d-flex align-items-center justify-content-center">
        <Spinner animation="grow" variant="success" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="view-product-wrapper">
        <Container className="text-center py-5">
          <h3 className="display-6">Product not found</h3>
        </Container>
      </div>
    );
  }

  const addToCart = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("user"));
      if (!storedUserData) {
        Swal.fire({
          title: "Please Login",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#2e7d32",
          confirmButtonText: "Login Now",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
        return;
      }

      const userId = storedUserData.id;
      const response = await axios.post(`${API_URL}/api/cart`, {
        userId: userId,
        productId: product.id,
        quantity: 1,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          text: `${product.name} has been added`,
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Swal.fire(
        "Error",
        "Could not add item to cart. Please try again.",
        "error",
      );
    }
  };

  const images = product.image ? product.image.split(",") : [];

  return (
    <div className="view-product-wrapper">
      <Container>
        <div className="product-card-container">
          <Row className="g-5">
            <Col lg={6} className="fade-up">
              <div className="main-image-viewport">
                {images.length > 0 ? (
                  <img
                    src={`${API_URL}/uploads/${images[activeImage]}`}
                    alt={product.name}
                    className="main-product-image"
                  />
                ) : (
                  <div
                    className="main-product-image"
                    style={{
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "400px",
                    }}
                  >
                    No Image Available
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="thumbnail-gallery fade-up delay-1">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail-item ${activeImage === index ? "active" : ""}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={`${API_URL}/uploads/${img}`}
                        alt={`${product.name}  ${index}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Col>

            <Col lg={6} className="product-info-column fade-up delay-1">
              <span className="organic-badge">Organic</span>
              <h1 className="product-title">{product.name}</h1>
              <p className="farmer-attribution">
                🧑‍🌾 Farm Fresh Produce • Grown with Love
              </p>

              <div className="price-display">
                ₹{product.price}
                <span className="price-unit">/kg</span>
              </div>

              <div className="description-section">
                <span className="description-label">Description</span>
                <p className="product-description-text">
                  {product.description}
                </p>
              </div>

              <div className="product-actions">
                <p
                  style={{
                    color: "#7f8c8d",
                    fontSize: "0.9rem",
                    marginBottom: "15px",
                  }}
                >
                  Sold by:{" "}
                  <strong>{product.vendor_name || "Generic Farm"}</strong>
                </p>
                <div className="quantity-selector" style={{ color: product.stock > 0 ? "#2e7d32" : "#d32f2f" }}>
                  <HiCheckCircle size={20} />
                  {product.stock > 0 ? (
                    <span>In Stock ({product.stock}kg available)</span>
                  ) : (
                    <span>Out of Stock</span>
                  )}
                </div>
              </div>

              <button 
                className="add-to-cart-btn" 
                onClick={addToCart}
                disabled={product.stock <= 0}
                style={{
                   opacity: product.stock <= 0 ? 0.6 : 1,
                   cursor: product.stock <= 0 ? "not-allowed" : "pointer"
                }}
              >
                <HiOutlineShoppingCart size={24} />
                {product.stock > 0 ? "Add to Shopping Cart" : "Currently Unavailable"}
              </button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ViewProduct;
