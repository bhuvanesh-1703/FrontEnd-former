import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { HiMinus, HiPlus, HiOutlineShoppingCart } from "react-icons/hi";
import Swal from "sweetalert2";
import "../css/RecentlyAdd.css";
import "../css/Product.css";

const CategoryView = () => {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/product?status=approved`,
      );
      setProducts(response.data.product);
    } catch (error) {
      // console.log("Product fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && id) {
      const filtered = products.filter(
        (prod) => Number(prod.categories_id) === Number(id),
      );
      setFilteredProducts(filtered);
    }
  }, [products, id]);

  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const updated = current + change;
      return {
        ...prev,
        [productId]: updated < 1 ? 1 : updated,
      };
    });
  };

  const addToCart = async (product) => {
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

      const userId = storedUserData.id || storedUserData._id;
      const quantity = quantities[product.id] || 1;
      const response = await axios.post(`${API_URL}/api/cart`, {
        userId: userId,
        productId: product.id,
        quantity: quantity,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          text: `${product.name} (${quantity}kg) has been added`,
          timer: 2000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        Swal.fire("Session Expired", "Please log in again.", "warning").then(
          () => {
            window.location.href = "/login";
          },
        );
      } else {
        Swal.fire(
          "Error",
          error.response?.data?.message ||
            "Could not add item to cart. Please try again.",
          "error",
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <section className="product-showcase">
      <Container>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h5>No products found in this category.</h5>
          </div>
        ) : (
          <Row className="g-4">
            <h1 style={{ textAlign: "center" }}>
              <span style={{ color: "#1b5e20" }}>Our</span>{" "}
              <span style={{ color: "#2db236ff" }}>Categories</span>
            </h1>
            {filteredProducts.map((product) => (
              <Col key={product.id} xs={6} sm={6} lg={3}>
                <article className="luxury-product-card">
                  {/* IMAGE */}
                  <div className="product-image-wrapper">
                    <Link to={`/productdetails/${product.id}`}>
                      <img
                        src={`${API_URL}/uploads/${product.image.split(",")[0]}`}
                        alt={product.name}
                        className="product-img"
                        loading="lazy"
                      />
                    </Link>
                    <div className="premium-badge">Organic</div>
                  </div>

                  {/* DETAILS */}
                  <div className="product-details">
                    <h3 className="p-card-name">
                      <Link to={`/productdetails/${product.id}`}>
                        {product.name.charAt(0).toUpperCase() +
                          product.name.slice(1)}
                      </Link>
                    </h3>

                    <p className="farmer-name">👨‍🌾 By Organic Farmer</p>

                    <div className="price-stock-row">
                      <div className="price">
                        <span className="amount">₹{product.price}</span>
                        <span className="unit">/kg</span>
                      </div>
                      <div className="in-stock">IN STOCK</div>
                    </div>

                    <div className="p-card-actions">
                      <div className="luxury-qty-pill">
                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(product.id, -1)}
                        >
                          <HiMinus />
                        </button>

                        <span className="qty-val">
                          {quantities[product.id] || 1}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() => handleQuantityChange(product.id, 1)}
                        >
                          <HiPlus />
                        </button>
                      </div>

                      <button
                        className="luxury-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        <HiOutlineShoppingCart />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default CategoryView;
