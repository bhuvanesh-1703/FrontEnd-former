import axios from "axios";
import API_URL from "../config";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { HiOutlineShoppingCart, HiMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Product.css";

const Product = () => {
  const [getProduct, setGetProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/product?status=approved`,
      );
      setGetProduct(response.data.product);
      setFilteredProducts(response.data.product);
    } catch (error) {
      console.error("failed to get product", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(getProduct);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();

    // Find category IDs that match the search query
    const matchingCategoryIds = categories
      .filter((cat) => cat.category_name.toLowerCase().includes(lowerQuery))
      .map((cat) => cat.id);

    const filtered = getProduct.filter((product) => {
      const productNameMatches = product.name
        .toLowerCase()
        .includes(lowerQuery);
      const categoryMatches = matchingCategoryIds.includes(
        Number(product.categories_id),
      );
      return productNameMatches || categoryMatches;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, getProduct, categories]);

  const handleQty = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
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
        window.dispatchEvent(new Event("cart-updated"));
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          text: `${product.name} (${quantity}kg) has been added `,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
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

  return (
    <section className="product-showcase">
      <Container>
        <h1 style={{ textAlign: "center", marginBottom: "5%" }}>
          {searchQuery ? (
            <>
              Search Results for:{" "}
              <span style={{ color: "#2e7d32" }}>"{searchQuery}"</span>
            </>
          ) : (
            <>
              Our <span style={{ color: "#2e7d32" }}>Organic</span>{" "}
              <span style={{ color: "#1b5e20" }}>Product</span>
            </>
          )}
        </h1>
        <Row className="g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product.id} xs={6} sm={6} lg={3}>
                <article className="luxury-product-card">
                  {/* IMAGE */}
                  <div className="product-image-wrapper">
                    {product.image ? (
                      <img
                        src={`${API_URL}/uploads/${product.image.split(",")[0]}`}
                        alt={product.name}
                        className="product-img"
                      />
                    ) : (
                      <div
                        className="product-img"
                        style={{
                          background: "#eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "200px",
                        }}
                      >
                        No Image Available
                      </div>
                    )}
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

                    <p className="farmer-name">👨‍🌾 By Local Farmer</p>

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
                          onClick={() => handleQty(product.id, -1)}
                        >
                          <HiMinus />
                        </button>

                        <span className="qty-val">
                          {quantities[product.id] || 1}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() => handleQty(product.id, 1)}
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
            ))
          ) : (
            <Col xs={12} className="text-center py-5">
              <h3>No products found matching your search.</h3>
              <p>Try different keywords or browse our categories.</p>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Product;
