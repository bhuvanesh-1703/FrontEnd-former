import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import {
  HiPlus,
  HiMinus,
  HiTrash,
  HiOutlineShoppingBag,
  HiArrowRight,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("user"));
      if (!storedUserData) {
        setLoading(false);
        return;
      }
      const userId = storedUserData.id || storedUserData._id;
      const response = await axios.get(
        `http://localhost:5100/api/cart?userId=${userId}`,
      );
      setCart(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log("failed to fetch Product", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = async (id, qty) => {
    if (qty < 1) return;
    try {
      await axios.put(`http://localhost:5100/api/cart/${id}`, {
        quantity: qty,
      });
      getCart();
    } catch (error) {
      console.log("Failed to update quantity", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Remove item?",
        text: "Are you sure you want to remove this item from your cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2e7d32",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
        border: "none",
        borderRadius: "1.5rem",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5100/api/cart/${id}`);
        getCart();
        Swal.fire({
          title: "Removed!",
          text: "Item has been removed from your cart.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.log("Failed to remove item", error);
    }
  };

  useEffect(() => {
    getCart();
    window.scrollTo(0, 0);
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="cart-wrapper d-flex align-items-center justify-content-center">
        <Spinner animation="grow" variant="success" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-wrapper">
        <Container>
          <div className="empty-cart-container animate__animated animate__fadeIn">
            <div className="empty-cart-icon">
              <HiOutlineShoppingBag />
            </div>
            <h2 className="empty-title">Your cart is empty</h2>
            <p className="text-muted">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products" className="shop-now-btn">
              Start Shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <Container>
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            You have {cart.length} items in your basket
          </p>
        </div>

        <Row className="g-5">
          <Col lg={8}>
            <div className="cart-items-container">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item-card animate__animated animate__fadeInUp"
                >
                  <div className="cart-item-image-wrapper">
                    <img
                      src={`http://localhost:5100/uploads/${item.image.split(",")[0]}`}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>

                  <div className="cart-item-info">
                    <Link
                      to={`/productdetails/${item.product_id}`}
                      className="item-name"
                    >
                      {item.name}
                    </Link>
                 

                    <p>{item.category_name}</p>
                    <div className="cart-item-controls mt-3">
                      <div className="qty-pill">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity - 1)
                          }
                        >
                          <HiMinus />
                        </button>

                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleQtyChange(item.id, item.quantity + 1)
                          }
                        >
                          <HiPlus />
                        </button>
                      </div>

                      <div className="item-price">
                        ₹{item.price * item.quantity}
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        <HiTrash size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <div className="cart-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">₹{total}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <HiArrowRight />
              </button>

              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
