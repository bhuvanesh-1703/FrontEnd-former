import axios from "axios";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiMinus,
  HiPlus,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/RecentlyAdd.css";

const Showcase = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [wishlist, setWishlist] = useState({});

  const handleQuantityChange = (id, delta) => {
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
          text: "You need to be logged in to add items to the cart.",
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
      const response = await axios.post("http://localhost:5100/api/cart", {
        userId: userId,
        productId: product.id,
        quantity: quantity,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          text: `${product.name} (${quantity}kg) has been added to your shopping basket.`,
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

  // const toggleWishlist = (id) => {
  //   setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  // };

  const fetchRecentProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5100/api/product?status=approved",
      );
      setRecentProducts(response.data.product.slice(0, 8));
    } catch (error) {
      console.log("Failed to fetch recent products", error);
    }
  };

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  return (
    <section className="product-showcase">
      <Container>
        <div className="showcase-header text-center mb-4">
          <span className="featured-label">Featured Products</span>
          <h1 className="showcase-title">
            Our <span className="highlight-luxury">Organic Farm</span>
          </h1>
          <p className="showcase-subtitle">
            Pure. Sustainable. Fresh seasonal harvests.
          </p>
        </div>

        <Row className="g-4">
          {recentProducts.map((product) => (
            <Col key={product.id} xs={6} sm={6} lg={3}>
              <article className="luxury-product-card">
                {/* IMAGE */}
                <div className="product-image-wrapper">
                  <Link to={`/productdetails/${product.id}`}>
                    <img
                      src={`http://localhost:5100/uploads/${product.image.split(",")[0]}`}
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                    />
                  </Link>

                  <div className="premium-badge">Organic</div>

                  {/* <button
                    className={`wishlist-btn ${
                      wishlist[product.id] ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <HiOutlineHeart />
                  </button> */}
                </div>

                {/* CONTENT */}
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
      </Container>
    </section>
  );
};

export default Showcase;
